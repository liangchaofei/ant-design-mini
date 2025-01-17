import { useEvent, useState } from 'functional-mini/component';
import { mountComponent } from '../../_util/component';
import { useComponentEvent } from '../../_util/hooks/useComponentEvent';
import useLayoutEffect from '../../_util/hooks/useLayoutEffect';
import { hasValue, useMergedState } from '../../_util/hooks/useMergedState';
import { triggerRefEvent } from '../../_util/hooks/useReportRef';
import { TextareaProps } from './props';

const Textarea = (props: TextareaProps) => {
  const isControlled = hasValue(props.controlled)
    ? !!props.controlled
    : hasValue(props.value);

  let option: any = {
    value: props.value,
  };
  if (!isControlled && hasValue(props.value)) {
    option = {
      defaultValue: props.value,
    };
  }
  const [value, updateValue] = useMergedState(props.defaultValue, option);
  const [selfFocus, setSelfFocus] = useState(false);
  const { triggerEvent } = useComponentEvent(props);
  triggerRefEvent();
  useLayoutEffect(
    (mount) => {
      if (!isControlled && !mount) {
        updateValue(props.value);
      }
    },
    [props.value]
  );

  useEvent('onChange', (e) => {
    const newValue = e.detail.value;
    if (!isControlled) {
      updateValue(newValue);
    } else {
    }
    triggerEvent('change', newValue, e);
  });

  useEvent('onFocus', (e) => {
    const newValue = e.detail.value;
    setSelfFocus(true);
    triggerEvent('focus', newValue, e);
  });

  useEvent('onBlur', (e) => {
    const newValue = e.detail.value;
    setSelfFocus(false);
    triggerEvent('blur', newValue, e);
  });

  useEvent('onConfirm', (e) => {
    const newValue = e.detail.value;
    triggerEvent('confirm', newValue, e);
  });
  useEvent('onClear', (e) => {
    if (!isControlled) {
      updateValue('');
    }
    triggerEvent('change', '', e);
  });

  useEvent('update', (e) => {
    if (isControlled) {
      return;
    }
    updateValue(e);
  });

  return {
    state: {
      value,
      controlled: isControlled,
    },
    selfFocus,
  };
};

mountComponent<TextareaProps>(Textarea, {
  value: null,
  defaultValue: null,
  placeholder: null,
  placeholderClassName: null,
  placeholderStyle: null,
  autoHeight: null,
  showCount: null,
  allowClear: null,
  controlled: null,
  enableNative: false,
  inputClassName: null,
  disabled: null,
  inputStyle: null,
  focusStyle: null,
  name: null,
  confirmType: null,
  focus: null,
  confirmHold: null,
});
