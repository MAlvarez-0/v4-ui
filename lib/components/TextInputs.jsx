import React from 'react'
import classnames from 'classnames'
import { omit } from 'lodash'
import { isBrowser } from 'react-device-detect'

const DEFAULT_INPUT_CLASS_NAME =
  'w-full py-2 px-5 trans outline-none focus:outline-none active:outline-none leading-none'

const sanitizeProps = (props) => {
  return omit(props, [
    'alignLeft',
    'label',
    'small',
    'large',
    'marginClassName',
    'paddingClassName',
    'borderClassName',
    'bgClassName',
    'inlineButton',
    'roundedClassName',
    'textClassName',
    'isError',
    'isLight',
    'register',
    'required', // required is consumed by the register func but we don't want it on the <input />
    'patternForHookForm',
    'tickerUpcased',
    'validate',
    'unsignedNumber',
    'unsignedWholeNumber',
    'rightLabel',
    'bottomRightLabel'
  ])
}

const collectClassNames = (props) => {
  return classnames(
    DEFAULT_INPUT_CLASS_NAME,
    props.marginClassName,
    props.paddingClassName,
    props.borderClassName,
    props.bgClassName,
    props.textClassName,
    props.roundedClassName,
    props.className,
    {
      'text-red': props.isError
    }
  )
}

export const SimpleInput = (props) => {
  const { autoFocus, value, ...inputProps } = props

  return (
    <input
      {...inputProps}
      autoFocus={autoFocus && isBrowser}
      value={value}
      className={DEFAULT_INPUT_CLASS_NAME}
    />
  )
}

export const RoundInput = (props) => {
  let { autoFocus, pattern, required, register, validate } = props

  const className = collectClassNames(props)

  return (
    <input
      {...sanitizeProps(props)}
      autoFocus={autoFocus && isBrowser}
      ref={register({
        required,
        pattern,
        validate
      })}
      className={classnames(className, 'focus:outline-none')}
    />
  )
}

RoundInput.defaultProps = {
  marginClassName: '',
  paddingClassName: 'px-8 py-3',
  borderClassName: 'border border-accent-3',
  bgClassName: 'bg-input',
  textClassName: 'text-xs',
  roundedClassName: 'rounded-full'
}

export const RectangularInput = (props) => {
  let { autoFocus, pattern, patternForHookForm, required, register, validate, readOnly } = props

  const className = collectClassNames(props)

  return (
    <input
      {...sanitizeProps(props)}
      autoFocus={autoFocus && isBrowser}
      ref={register({
        required,
        pattern: patternForHookForm,
        validate
      })}
      className={classnames(className, {
        'text-default opacity-50': readOnly
      })}
      style={{
        backgroundColor: readOnly ? 'var(--color-bg-readonly-tsunami)' : '',
        borderColor: readOnly ? 'var(--color-border-readonly-tsunami)' : ''
      }}
    />
  )
}

RectangularInput.defaultProps = {
  marginClassName: '',
  paddingClassName: 'px-8 py-4',
  borderClassName: 'border-2 border-primary hover:border-secondary focus:border-secondary',
  bgClassName: 'bg-transparent',
  textClassName: 'text-xl text-right',
  roundedClassName: 'rounded-lg',
  className: 'font-inter font-semibold'
}