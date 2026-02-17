package extaws

import (
	"bytes"
	"context"
	"errors"
	"io"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/aws/transport/http"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/smithy-go"
)

type S3Client = s3.Client

type S3Config struct {
	Region            *string // AWS region for S3 service
	AccessKey         *string // #nosec G117 AWS access key ID
	SecretAccessKey   *string // AWS secret access key
	IsDirectoryBucket bool    // Whether to use S3 directory bucket mode
}

type S3FileCreateData struct {
	BucketName  string // Name of the S3 bucket
	FileName    string // Name/path of the file in S3
	FileContent []byte // Content of the file to be uploaded
}

type S3FileRetrieveData struct {
	Body            *string // File content as a string
	ContentEncoding *string // Content encoding of the file
	ContentLanguage *string // Content language of the file
	ContentLength   *int64  // Size of the file in bytes
	ContentType     *string // MIME type of the file
}

func InitS3(cfg S3Config) *S3Client {
	awsCfg := aws.Config{
		Region: *cfg.Region,
		Credentials: credentials.NewStaticCredentialsProvider(*cfg.AccessKey,
			*cfg.SecretAccessKey, ""),
	}

	if cfg.IsDirectoryBucket {
		httpClient := http.NewBuildableClient()

		customCfg, err := config.LoadDefaultConfig(
			context.Background(),
			config.WithRegion(*cfg.Region),
			config.WithCredentialsProvider(
				credentials.NewStaticCredentialsProvider(
					*cfg.AccessKey, *cfg.SecretAccessKey, "",
				)),
			config.WithHTTPClient(httpClient),
			config.WithEC2IMDSRegion(),
		)

		if err == nil {
			awsCfg = customCfg
		}

		return s3.NewFromConfig(awsCfg, func(o *s3.Options) {
			o.UsePathStyle = true
		})
	}

	return s3.NewFromConfig(awsCfg)
}

func CreateFile(ctx context.Context, client S3Client,
	info S3FileCreateData) error {
	_, err := client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(info.BucketName),
		Key:    aws.String(info.FileName),
		Body:   bytes.NewReader(info.FileContent),
	})

	if err != nil {
		return handleS3Error(err)
	}

	err = s3.NewObjectExistsWaiter(&client).Wait(ctx,
		&s3.HeadObjectInput{
			Bucket: aws.String(info.BucketName),
			Key:    aws.String(info.FileName),
		}, time.Minute)

	return err
}

func ReadFile(ctx context.Context, client S3Client,
	bucket, key, bucketOwnerID *string) (*S3FileRetrieveData, error) {
	output, err := client.GetObject(ctx, &s3.GetObjectInput{
		Bucket:              bucket,
		Key:                 key,
		ExpectedBucketOwner: bucketOwnerID,
	})

	if err != nil {
		return nil, handleS3Error(err)
	}

	body, err := io.ReadAll(output.Body)
	if err != nil {
		if bodyErr := output.Body.Close(); bodyErr != nil {
			err = handleS3Error(bodyErr)
		}

		return nil, handleS3Error(err)
	}

	defer func() {
		if bodyErr := output.Body.Close(); bodyErr != nil {
			err = handleS3Error(bodyErr)
		}
	}()

	bodyStr := string(body)

	return &S3FileRetrieveData{
		Body:            &bodyStr,
		ContentEncoding: output.ContentEncoding,
		ContentLanguage: output.ContentLanguage,
		ContentLength:   output.ContentLength,
		ContentType:     output.ContentType,
	}, nil
}

func SaveFile(ctx context.Context, client S3Client,
	info S3FileCreateData) error {
	return CreateFile(ctx, client, info)
}

func DeleteFile(ctx context.Context, client S3Client,
	bucket, key, bucketOwnerID *string) error {
	_, err := client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket:              bucket,
		Key:                 key,
		ExpectedBucketOwner: bucketOwnerID,
	})

	return err
}

func GenerateS3FilePath(directoryPath string, fileNames ...string) string {
	fullPath := directoryPath
	for _, fileName := range fileNames {
		fullPath += "/" + fileName
	}

	return fullPath
}

func GenerateGetPresignedURL(ctx context.Context, client S3Client,
	bucket, key string, lifetime time.Duration) (*string, error) {
	presignClient := s3.NewPresignClient(&client)
	presignedURL, err := presignClient.PresignGetObject(ctx,
		&s3.GetObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		}, func(opts *s3.PresignOptions) {
			opts.Expires = lifetime
		})

	if err != nil {
		return nil, handleS3Error(err)
	}

	return &presignedURL.URL, nil
}

func GeneratePutPresignedURL(ctx context.Context, client S3Client,
	bucket, key string, lifetime time.Duration) (*string, error) {
	presignClient := s3.NewPresignClient(&client)
	presignedURL, err := presignClient.PresignPutObject(ctx,
		&s3.PutObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		}, func(opts *s3.PresignOptions) {
			opts.Expires = lifetime
		})

	if err != nil {
		return nil, handleS3Error(err)
	}

	return &presignedURL.URL, nil
}

func GenerateDeletePresignedURL(ctx context.Context, client S3Client,
	bucket, key string, lifetime time.Duration) (*string, error) {
	presignClient := s3.NewPresignClient(&client)
	presignedURL, err := presignClient.PresignDeleteObject(ctx,
		&s3.DeleteObjectInput{
			Bucket: aws.String(bucket),
			Key:    aws.String(key),
		}, func(opts *s3.PresignOptions) {
			opts.Expires = lifetime
		})

	if err != nil {
		return nil, handleS3Error(err)
	}

	return &presignedURL.URL, nil
}

func GeneratePublicURL(region, bucketName, key *string) *string {
	// revive:disable:line-length-limit

	url := "https://" + *bucketName + ".s3." + *region + ".amazonaws.com/" + *key

	// revive:enable:line-length-limit

	return &url
}

func handleS3Error(err error) error {
	// Error codes:
	//
	// https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html
	var apiErr smithy.APIError
	if errors.As(err, &apiErr) {
		return errors.New(apiErr.ErrorCode())
	}

	return err
}
