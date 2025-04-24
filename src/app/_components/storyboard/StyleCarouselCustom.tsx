"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type CarouselProps = {
  options?: EmblaOptionsType;
  slides: React.ReactNode[];
  className?: string;
  handleSlideChange: (index: number) => void;
};

export function Carousel({
  options,
  slides,
  className,
  handleSlideChange,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    ...options,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = React.useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(
    () => emblaApi?.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = React.useCallback(
    () => emblaApi?.scrollNext(),
    [emblaApi],
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());

    // Notify parent component of the active slide
    handleSlideChange(currentIndex);
  }, [emblaApi, handleSlideChange]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // Initial check
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      {/* Carousel Viewport */}
      <div ref={emblaRef} className="overflow-hidden rounded-lg bg-background">
        <div className="flex">{slides}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          aria-label="Next Slide"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors duration-200",
              index === selectedIndex ? "bg-foreground" : "bg-foreground/20",
            )}
            aria-label={`Slide ${index + 1}`}
            role="button"
          />
        ))}
      </div>
    </div>
  );
}
