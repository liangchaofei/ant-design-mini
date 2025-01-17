import dayjs from 'dayjs';
import { useEvent, useState, useMemo } from 'functional-mini/component';
import '../_util/assert-component2';
import { mountComponent } from '../_util/component';
import { useComponentEvent } from '../_util/hooks/useComponentEvent';
import { useMixState } from '../_util/hooks/useMixState';
import { resolveEventValues } from '../_util/platform';
import { IDatePickerProps } from './props';
import {
  getDateByValue,
  getRangeData,
  getValidValue,
  getValueByDate,
} from './util';

function getMin(min) {
  return min ? dayjs(min as any) : dayjs().subtract(10, 'year');
}

function getMax(max) {
  return max ? dayjs(max as any) : dayjs().add(10, 'year');
}

const DatePicker = (props: IDatePickerProps) => {
  const [realValue, { isControlled, update }] = useMixState(
    props.defaultValue,
    {
      value: props.value,
      postState(value) {
        if (value) {
          return {
            valid: true,
            value: dayjs(value).toDate(),
          };
        }
        return {
          valid: true,
          value: undefined,
        };
      },
    }
  );

  function defaultFormat(value, valueStr) {
    if (props.format && valueStr) {
      return valueStr;
    }
    return '';
  }
  const { triggerEvent, triggerEventValues, triggerEventOnly } =
    useComponentEvent(props);

  function onFormatLabel(type, value) {
    const { onFormatLabel } = props;
    if (typeof onFormatLabel === 'function') {
      const formatValueByProps = onFormatLabel(type, value);
      if (typeof formatValueByProps !== 'undefined') {
        return String(formatValueByProps);
      }
    }
    return defaultFormatLabel(type, value);
  }
  function defaultFormatLabel(type, value) {
    const suffixMap = {
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分',
      second: '秒',
    };
    return `${value}${suffixMap[type]}`;
  }

  const [{ visible, value, columns }, setState] = useState({
    visible: false,
    value: [],
    columns: [],
  });

  function generateData(currentValue, currentProps) {
    const { precision, min: propsMin, max: propsMax } = currentProps;
    const min = getMin(propsMin);
    const max = getMax(propsMax);
    if (max < min) {
      return [];
    }
    let currentPickerDay = dayjs();
    if (currentValue.length > 0) {
      currentPickerDay = dayjs(getDateByValue(currentValue));
    }
    if (currentPickerDay < min || currentPickerDay > max) {
      currentPickerDay = min;
    }
    const newColumns = getRangeData(
      precision,
      min,
      max,
      currentPickerDay,
      onFormatLabel
    );
    return newColumns;
  }

  function getCurrentValueWithCValue(currentProps) {
    const { min, max, precision } = currentProps;
    if (realValue) {
      return getValueByDate(realValue, precision);
    } else {
      const now = new Date();
      if (
        !(min && dayjs(now).isBefore(dayjs(min as any), precision)) &&
        !(max && dayjs(now).isAfter(dayjs(max as any), precision))
      ) {
        return getValueByDate(now, precision);
      } else {
        return getValueByDate(getMin(min).toDate(), precision);
      }
    }
  }

  useEvent('onVisibleChange', (visible) => {
    if (visible) {
      const currentValue = getCurrentValueWithCValue(props);
      const newColumns = generateData(currentValue, props);
      setState({
        value: currentValue,
        columns: newColumns,
        visible: true,
      });
    } else {
      setState({
        value: [],
        columns: [],
        visible: false,
      });
    }
    triggerEvent('visibleChange', visible, {});
  });

  useEvent('onChange', (event) => {
    let [selectedIndex] = resolveEventValues(event);
    selectedIndex = getValidValue(selectedIndex);
    const { format, precision } = props;
    let date = getDateByValue(selectedIndex);
    const min = getMin(props.min);
    const max = getMax(props.max);
    if (dayjs(date).isBefore(min)) {
      date = min.toDate();
      selectedIndex = getValueByDate(date, precision);
    }
    if (dayjs(date).isAfter(max)) {
      date = max.toDate();
      selectedIndex = getValueByDate(date, precision);
    }
    const newColumns = generateData(selectedIndex, props);

    setState({
      visible: true,
      columns: newColumns,
      value: selectedIndex,
    });

    const pickDate = getDateByValue(selectedIndex);
    triggerEventValues(
      'pickerChange',
      [pickDate, dayjs(pickDate).format(format)],
      {}
    );
  });

  useEvent('onCancel', (e) => {
    triggerEventOnly('cancel', e);
  });

  useEvent('onOk', () => {
    const { format } = props;
    const date = getDateByValue(value);
    if (!isControlled) {
      update(date);
    }
    triggerEventValues('ok', [date, dayjs(date).format(format)], {});
  });

  const formattedValueText = useMemo(() => {
    const { onFormat, format } = props;
    if (typeof onFormat === 'function') {
      const formatValueByProps = onFormat(
        realValue,
        realValue ? dayjs(realValue).format(format) : null
      );

      if (typeof formatValueByProps !== 'undefined') {
        return formatValueByProps;
      }
    }
    return defaultFormat(
      realValue,
      realValue ? dayjs(realValue).format(format) : null
    );
  }, [realValue]);

  return {
    formattedValueText,
    currentValue: visible ? value : realValue,
    columns,
  };
};

mountComponent(DatePicker, {
  animationType: 'transform',
  format: 'YYYY/MM/DD',
  min: null,
  max: null,
  value: null,
  defaultValue: null,
  title: '',
  okText: '确定',
  cancelText: '取消',
  placeholder: '请选择',
  precision: 'day',
  maskClosable: true,
  popClassName: '',
  popStyle: '',
  disabled: false,
  onFormatLabel: null,
});
