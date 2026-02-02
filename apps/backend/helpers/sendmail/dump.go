package sendmail

import (
	"fmt"

	"backend/cmd/glob"
	"backend/pkg/intstr"
)

func sendLocally(i Info) bool {
	shouldUseLocal := glob.Config.ShouldPreventSendEmailInLocal
	if !shouldUseLocal {
		return false
	}

	_, _ = fmt.Println("<-- email begin -->")
	_, _ = fmt.Printf("title:   %s\n", intstr.Trim(intstr.Safe(i.Title)))
	_, _ = fmt.Printf("from:    %s\n", intstr.Trim(intstr.Safe(i.From)))
	_, _ = fmt.Printf("to:      %s\n", intstr.Trim(intstr.Safe(i.To)))
	_, _ = fmt.Printf("subject: %s\n", intstr.Trim(intstr.Safe(i.Subject)))
	_, _ = fmt.Printf("content: %s\n", intstr.Trim(intstr.Safe(i.Content)))
	_, _ = fmt.Printf("config:  %s\n", intstr.Trim(intstr.Safe(i.Config)))
	_, _ = fmt.Println("<-- email end -->")

	return true
}
