import { Router, Request, Response } from "express";

const router = Router();

router.post("/", (_req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "POST additional intake funcionando",
  });
});

router.post("/analyze", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Analyze image funcionando",
  });
});

router.patch("/:id/confirm", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Confirm intake funcionando",
    id: req.params.id,
  });
});

router.post("/:id/discard", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Discard intake funcionando",
    id: req.params.id,
  });
});

export default router;