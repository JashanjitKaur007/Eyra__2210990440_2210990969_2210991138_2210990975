// this is the error boundary component


import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';


// this is the error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/60 to-teal-50 flex items-center justify-center p-6">

          {/* Card */}
          <div className="max-w-md w-full bg-white/80 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-2xl p-10 text-center">

            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <AlertTriangle className="w-9 h-9" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-semibold text-slate-950 mb-4 tracking-tight">
              Something went wrong
            </h1>

            {/* Description */}
            <p className="text-slate-600 mb-8 leading-relaxed">
              We're sorry — something unexpected happened.  
              You can refresh the page or try again.
            </p>

            {/* Actions */}
            <div className="space-y-4">

              {/* Primary CTA */}
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>

              {/* Secondary */}
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full px-6 py-3.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition"
              >
                Try Again
              </button>
            </div>

            {/* Dev Mode Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                  Show error details
                </summary>

                <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  <div>
                    <strong>Stack trace:</strong>
                    <pre className="whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;