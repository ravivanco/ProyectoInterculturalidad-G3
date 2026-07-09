import { Router, Response } from 'express';
import multer from 'multer';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import { uploadImageBuffer, isCloudinaryConfigured } from '../config/cloudinary';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @openapi
 * /api/uploads/image:
 *   post:
 *     summary: Subir una imagen a Cloudinary (solo nutricionistas)
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *       400:
 *         description: No se envió ninguna imagen
 *       403:
 *         description: Solo nutricionistas pueden subir imágenes
 *       500:
 *         description: Error al subir la imagen o Cloudinary no configurado
 */
router.post(
  '/image',
  authGuard,
  upload.single('image'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'nutricionista') {
        res.status(403).json({ success: false, message: 'Forbidden - only nutritionists can upload images' });
        return;
      }

      if (!isCloudinaryConfigured()) {
        res.status(500).json({
          success: false,
          message: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ success: false, message: 'No image file provided. Use the "image" field.' });
        return;
      }

      const result = await uploadImageBuffer(req.file.buffer);

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully.',
        data: { url: result.url, publicId: result.publicId },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message || 'Error uploading image.' });
    }
  }
);

export default router;
