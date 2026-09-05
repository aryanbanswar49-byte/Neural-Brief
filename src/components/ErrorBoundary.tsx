import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Uncaught Application Error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121316] text-[#e2e2e6] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#1b1c1f] border border-[#2d2e33] rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-sm text-[#909099] leading-relaxed">
                An unexpected error occurred while rendering the page. If you just deployed, make sure all environment variables are properly configured in your hosting dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#121316] border border-[#2d2e33] rounded-lg p-4 font-mono text-xs text-red-300 overflow-x-auto max-h-48">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-container hover:bg-primary text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors"
              >
                <Home size={14} />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
