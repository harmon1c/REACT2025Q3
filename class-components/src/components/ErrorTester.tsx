import React, { Component } from 'react';

interface ErrorTesterState {
  shouldThrow: boolean;
}

export class ErrorTester extends Component<
  Record<string, never>,
  ErrorTesterState
> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { shouldThrow: false };
  }

  private throwError = (): void => {
    this.setState({ shouldThrow: true });
  };

  public override render(): React.JSX.Element {
    if (this.state.shouldThrow) {
      throw new Error('Test error thrown by ErrorTester component');
    }

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={this.throwError}
          className="px-6 py-3 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-red-600 hover:border-red-700"
          title="Test Error Boundary"
        >
          🚨 Test Error Boundary
        </button>
      </div>
    );
  }
}
