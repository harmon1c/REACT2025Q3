import React, { Component } from 'react';

interface MainProps {
  children: React.ReactNode;
}

export class Main extends Component<MainProps> {
  public override render(): React.JSX.Element {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">{this.props.children}</div>
      </main>
    );
  }
}
