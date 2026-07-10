import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Keyboard } from 'react-native';
import App from '../App';

jest.mock('../services/sync', () => ({
  initSyncListeners: jest.fn(() => jest.fn()),
}));

jest.mock('../store/useTriageStore', () => ({
  useTriageStore: (selector: any) =>
    selector({
      loadFromDisk: jest.fn(),
      pendingCount: 0,
      addRecord: jest.fn(),
    }),
}));

describe('keyboard dismissal', () => {
  it('dismisses the keyboard when the screen is tapped outside the inputs', () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss').mockImplementation(jest.fn());

    let component: renderer.ReactTestRenderer;
    act(() => {
      component = renderer.create(<App />);
    });

    const overlay = component!.root.findByProps({ testID: 'dismiss-keyboard-overlay' });

    act(() => {
      overlay.props.onPress();
    });

    expect(dismissSpy).toHaveBeenCalled();
    component!.unmount();
    dismissSpy.mockRestore();
  });
});
