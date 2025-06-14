import { useEffect } from "react";

type ScrollRef = React.RefObject<HTMLElement>;

function useSmoothScroll(refs: ScrollRef[] = [], active: boolean = true) {
    useEffect(() => {
        if (!active || typeof window === "undefined" || typeof document === "undefined") return;

        const scrollingElement = document.scrollingElement || document.documentElement;

        let scrollTarget = scrollingElement.scrollTop;
        let currentScroll = scrollingElement.scrollTop;
        const ease = 0.08;
        let ticking = false;
        let autoSnap = true;
        let snapTimeout: number | null = null;
        const SNAP_THRESHOLD = 500;

        let observer: MutationObserver | null = null;

        const getSortedPositions = (): number[] => {
            return refs
                .map(ref => ref.current)
                .filter((el): el is HTMLElement => !!el && document.body.contains(el))
                .map(el => el.offsetTop)
                .sort((a, b) => a - b);
        };

        const updateScroll = () => {
            const diff = scrollTarget - currentScroll;
            currentScroll += diff * ease;
            scrollingElement.scrollTo(0, currentScroll);

            if (Math.abs(diff) > 0.5) {
                requestAnimationFrame(updateScroll);
            } else {
                ticking = false;

                if (autoSnap) {
                    const positions = getSortedPositions();

                    if (positions.length > 0) {
                        const currentY = scrollingElement.scrollTop;
                        const nearest = positions.reduce((prev, curr) =>
                            Math.abs(curr - currentY) < Math.abs(prev - currentY) ? curr : prev
                        );

                        if (Math.abs(nearest - currentY) < SNAP_THRESHOLD) {
                            scrollTarget = nearest;

                            if (Math.abs(nearest - currentScroll) > 1) {
                                ticking = true;
                                requestAnimationFrame(updateScroll);
                            }
                        }
                    }
                }
            }
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            autoSnap = false;

            scrollTarget += e.deltaY;
            scrollTarget = Math.max(
                0,
                Math.min(scrollTarget, document.body.scrollHeight - window.innerHeight)
            );

            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateScroll);
            }

            if (snapTimeout) clearTimeout(snapTimeout);
            snapTimeout = window.setTimeout(() => {
                autoSnap = true;
            }, 400);
        };

        const onResize = () => {
            // Peut servir à recalculer certaines métriques si besoin
            getSortedPositions();
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("resize", onResize);

        observer = new MutationObserver(() => {
            getSortedPositions();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("resize", onResize);
            if (snapTimeout) clearTimeout(snapTimeout);
            observer?.disconnect();
        };
    }, [refs, active]);
}

export default useSmoothScroll;