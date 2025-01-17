import { View, Slot, TSXMLProps, InternalData } from 'tsxml';
import FormItem from '../FormItem/index.axml';
import RangePicker from '../../DatePicker/RangePicker/index.axml';
import Icon from '../../Icon/index.axml';
import { FormRangePickerProps } from './props';
import arrowUtil from '../../_util/arrow.sjs';

export default (
  {
    className,
    position,
    label,
    labelWidth,
    tooltip,
    requiredMark,
    style,
    endPlaceholder,
    startPlaceholder,
    splitCharacter,
    min,
    max,
    format,
    precision,
    animationType,
    cancelText,
    okText,
    placeholder,
    maskClosable,
    maskStyle,
    popClassName,
    popStyle,
    disabled,
    title,
    maskClassName,
    indicatorStyle,
    indicatorClassName,
    extra,
    arrow,
    validateStatus,
    help,
  }: TSXMLProps<FormRangePickerProps>,
  { formData, item }: InternalData
) => (
  <Component>
    <FormItem
      className={className}
      position={position}
      label={label}
      labelWidth={labelWidth}
      status={formData.status}
      errors={formData.errors}
      tooltip={tooltip}
      required={formData.required}
      requiredMark={requiredMark}
      validateStatus={validateStatus}
      help={help}
    >
      <View>
        <RangePicker
          endPlaceholder={endPlaceholder}
          startPlaceholder={startPlaceholder}
          splitCharacter={splitCharacter}
          min={min}
          max={max}
          format={format}
          precision={precision}
          animationType={animationType}
          cancelText={cancelText}
          okText={okText}
          placeholder={placeholder}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          popClassName={popClassName}
          style={style}
          popStyle={popStyle}
          disabled={disabled}
          title={title}
          maskClassName={maskClassName}
          indicatorStyle={indicatorStyle}
          indicatorClassName={indicatorClassName}
          value={formData.value}
          onOk="onOk"
          onPickerChange="onPickerChange"
          onCancel="onDismissPicker"
          onVisibleChange="onVisibleChange"
          onFormatLabel="onFormatLabel"
          onFormat="onFormat"
        >
          <Slot name="content" slot="content" />
          <Slot name="title" slot="title" />
          {arrowUtil.getArrow(arrow) && (
            <Icon
              className="ant-form-range-picker-arrow"
              type={arrowUtil.getArrow(arrow)}
              slot="suffix"
            />
          )}
        </RangePicker>
      </View>
      <View slot="extra">
        {/* #if ALIPAY */}
        <Slot name="extra">
          {/* #endif */}
          {extra}
          {/* #if ALIPAY */}
        </Slot>
        {/* #endif */}
      </View>
      <View slot="header" slot-scope="item">
        <Slot name="header" errors={item.errors} status={item.status} />
      </View>
      <View slot="footer" slot-scope="item">
        <Slot name="footer" errors={item.errors} status={item.status} />
      </View>
    </FormItem>
  </Component>
);
