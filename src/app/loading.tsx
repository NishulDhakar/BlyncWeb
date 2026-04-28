import { DotmSquare8 } from "@/components/ui/dotm-square-8";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                    <DotmSquare8
      size={32}
      dotSize={4}
      speed={1.4}
      opacityBase={0.1}
      opacityMid={0.4}
      opacityPeak={0.95}
    />
          
            </div>
        </div>
    );
}
