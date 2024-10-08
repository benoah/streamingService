import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle method is called when an error occurs in the child components
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  // This method logs the error details to the console or an error reporting service
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error occurred:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error is caught
      return <h2>Something went wrong. Please try again later.</h2>;
    }

    // Render child components if no error is present
    return this.props.children;
  }
}

export default ErrorBoundary;
