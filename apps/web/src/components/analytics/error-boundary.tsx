import { Component, type ReactNode } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ChartErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error) {
    // Error caught and handled in render
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Unable to load chart on this device
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
