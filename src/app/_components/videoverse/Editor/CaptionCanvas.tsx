import React, { FC, useRef, useEffect } from "react";

interface CaptionCanvasProps {
  onClick?: () => void; // Optional onClick prop
}

const CaptionCanvas: FC<CaptionCanvasProps> = ({ onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fonts = [
      "Arial",
      "Courier New",
      "Georgia",
      "Poetsen One",
      "Comic Sans MS",
      "Impact",
      "Tahoma",
    ];

    const captions = [
      "Arial",
      "Courier New",
      "Georgia",
      "Poetsen One",
      "Comic Sans MS",
      "Impact",
      "Tahoma",
    ];

    let fontIndex = 0;
    let captionIndex = 0;
    let frameCount = 0;
    let animationFrameId: number;

    function drawCaption() {
      // Clear the canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set up styles
        ctx.fillStyle = "#fff";
        ctx.font = `20px ${fonts[fontIndex]}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw the caption
        ctx.fillText(
          captions[captionIndex],
          canvas.width / 2,
          canvas.height / 2,
        );
      }
    }

    function animate() {
      // Update every 60 frames (~1 second at 60 FPS)
      if (frameCount % 60 === 0) {
        fontIndex = (fontIndex + 1) % fonts.length; // Cycle through fonts
        captionIndex = (captionIndex + 1) % captions.length; // Cycle through captions
        drawCaption(); // Redraw the text
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(animate);
    }

    // Start the animation
    animate();

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width="170" // Set canvas width
        height="120" // Set canvas height
        style={{ border: "1px solid #000" }}
        onClick={onClick} // Bind the onClick prop to the canvas
        className="cursor-pointer hover:shadow-sm hover:shadow-xw-primary"
      ></canvas>
    </div>
  );
};

export default CaptionCanvas;
