#include <ApplicationServices/ApplicationServices.h>
#include <CoreFoundation/CoreFoundation.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
  char *format_name;
  char *data_preview;
  size_t data_size;
  bool is_text;
} ClipboardFormat;

void print_hex_dump(const unsigned char *data, size_t size) {
  printf("\n[hex dump - %zu bytes]\n\n", size);

  for (size_t i = 0; i < size; i++) {
    if (i % 16 == 0) {
      if (i > 0) {
        printf("\n");
      }

      printf("%04zx:  ", i);
    }

    printf("%02x ", data[i]);
  }

  printf("\n\n[ascii representation]\n\n");
  for (size_t i = 0; i < size; i++) {
    if (i % 64 == 0 && i > 0) {
      printf("\n");
    }

    printf("%c", (data[i] >= 32 && data[i] <= 126) ? data[i] : '.');
  }

  printf("\n");
}

void inspect_clipboard() {
  PasteboardRef clipboard;
  OSStatus status = PasteboardCreate(kPasteboardClipboard, &clipboard);

  if (status != noErr) {
    printf("could not access clipboard (status: %d)\n", (int)status);
    return;
  }

  PasteboardSynchronize(clipboard);

  ItemCount itemCount;
  status = PasteboardGetItemCount(clipboard, &itemCount);

  printf("\ngeneral statistics:\n");
  printf("\ttotal items: %ld\n", (long)itemCount);

  for (ItemCount i = 1; i <= itemCount; i++) {
    printf("\nitem #%ld:\n", (long)i);

    PasteboardItemID itemID;
    status = PasteboardGetItemIdentifier(clipboard, i, &itemID);

    if (status != noErr)
      continue;

    CFArrayRef flavorTypeArray;
    status = PasteboardCopyItemFlavors(clipboard, itemID, &flavorTypeArray);

    if (status != noErr) {
      continue;
    }

    CFIndex flavorCount = CFArrayGetCount(flavorTypeArray);
    printf("\t available formats: %ld\n\n", (long)flavorCount);

    for (CFIndex j = 0; j < flavorCount; j++) {
      CFStringRef flavorType =
          (CFStringRef)CFArrayGetValueAtIndex(flavorTypeArray, j);

      char flavorName[256];
      CFStringGetCString(flavorType, flavorName, sizeof(flavorName),
                         kCFStringEncodingUTF8);

      printf("\t[format %ld]: %s\n", (long)(j + 1), flavorName);

      CFDataRef flavorData;
      status = PasteboardCopyItemFlavorData(clipboard, itemID, flavorType,
                                            &flavorData);

      if (status == noErr && flavorData != NULL) {
        CFIndex dataLength = CFDataGetLength(flavorData);
        const UInt8 *dataBytes = CFDataGetBytePtr(flavorData);

        printf("\t\tsize: %ld bytes\n", (long)dataLength);

        bool isTextLike = (strstr(flavorName, "string") != NULL ||
                           strstr(flavorName, "text") != NULL ||
                           strstr(flavorName, "rtf") != NULL ||
                           strstr(flavorName, "html") != NULL ||
                           strstr(flavorName, "utf8") != NULL);

        printf("\t\ttype: %s\n", isTextLike ? "text/markup" : "binary/other");

        if (dataLength > 0) {
          printf("\t\tdata:\n");

          if (isTextLike) {
            char *textBuffer = malloc(dataLength + 1);
            if (textBuffer) {
              memcpy(textBuffer, dataBytes, dataLength);
              textBuffer[dataLength] = '\0';

              printf("\t\t\t\"");
              for (CFIndex k = 0; k < dataLength; k++) {
                char c = textBuffer[k];
                if (c == '\n') {
                  printf("\\n");
                } else if (c == '\r') {
                  printf("\\r");
                } else if (c == '\t') {
                  printf("\\t");
                } else if (c >= 32 && c <= 126) {
                  printf("%c", c);
                } else {
                  printf("\\x%02x", (unsigned char)c);
                }
              }

              printf("\"\n");
              free(textBuffer);
            }
          } else {
            print_hex_dump(dataBytes, dataLength);
          }
        }

        printf("\n");
        CFRelease(flavorData);
      } else {
        printf("\t\tcould not retrieve data\n\n");
      }
    }

    CFRelease(flavorTypeArray);
  }

  const char *common_formats[] = {"public.utf8-plain-text",
                                  "public.utf16-plain-text",
                                  "public.rtf",
                                  "public.html",
                                  "public.png",
                                  "public.jpeg",
                                  "public.tiff",
                                  "public.file-url",
                                  "public.url",
                                  "com.apple.webarchive",
                                  "CorePasteboardFlavorType 0x75743136",
                                  "CorePasteboardFlavorType 0x75746638",
                                  NULL};

  printf("\n[common formats]\n\n");

  for (int i = 0; common_formats[i] != NULL; i++) {
    CFStringRef formatStr = CFStringCreateWithCString(NULL, common_formats[i],
                                                      kCFStringEncodingUTF8);

    for (ItemCount item = 1; item <= itemCount; item++) {
      PasteboardItemID itemID;
      if (PasteboardGetItemIdentifier(clipboard, item, &itemID) == noErr) {
        CFDataRef data;
        if (PasteboardCopyItemFlavorData(clipboard, itemID, formatStr, &data) ==
            noErr) {
          printf("\tfound: %s - %ld bytes\n", common_formats[i],
                 (long)CFDataGetLength(data));

          CFRelease(data);
        } else {
          printf("\tnot found: %s\n", common_formats[i]);
        }
      }
    }

    CFRelease(formatStr);
  }

  CFRelease(clipboard);
}

int main() {
  inspect_clipboard();
  return 0;
}
