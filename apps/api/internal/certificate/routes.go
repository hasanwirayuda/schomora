package certificate

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, h *Handler, authMiddleware gin.HandlerFunc) {
    api := r.Group("/api")

    // Public — verifikasi sertifikat tanpa login
    api.GET("/verify/:id", h.VerifyCertificate)

    // Protected
    protected := api.Group("/")
    protected.Use(authMiddleware)
    {
        protected.POST("/courses/:id/certificate", h.GenerateCertificate)
        protected.GET("/me/certificates", h.GetMyCertificates)
        protected.GET("/certificates/:id/download", h.DownloadCertificate)
    }
}