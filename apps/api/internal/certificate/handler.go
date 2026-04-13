package certificate

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hasanwirayuda/schomora/api/internal/models"
)

type Handler struct {
    service Service
}

func NewHandler(service Service) *Handler {
    return &Handler{service}
}

func currentUser(c *gin.Context) *models.User {
    user, _ := c.Get("currentUser")
    return user.(*models.User)
}

func (h *Handler) GenerateCertificate(c *gin.Context) {
    courseID := c.Param("id")
    user := currentUser(c)

    cert, pdf, err := h.service.GenerateCertificate(user.ID, courseID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Return PDF langsung sebagai download
    c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="schomora-certificate-%s.pdf"`, cert.ID.String()))
    c.Header("Content-Type", "application/pdf")
    c.Data(http.StatusOK, "application/pdf", pdf)
}

func (h *Handler) GetMyCertificates(c *gin.Context) {
    user := currentUser(c)

    certs, err := h.service.GetMyCertificates(user.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, certs)
}

func (h *Handler) DownloadCertificate(c *gin.Context) {
    id := c.Param("id")
    user := currentUser(c)

    cert, pdf, err := h.service.DownloadCertificate(id, user.ID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="schomora-certificate-%s.pdf"`, cert.ID.String()))
    c.Header("Content-Type", "application/pdf")
    c.Data(http.StatusOK, "application/pdf", pdf)
}

func (h *Handler) VerifyCertificate(c *gin.Context) {
    id := c.Param("id")

    cert, err := h.service.VerifyCertificate(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{
            "valid":   false,
            "message": err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "valid":       true,
        "certificate": cert,
    })
}