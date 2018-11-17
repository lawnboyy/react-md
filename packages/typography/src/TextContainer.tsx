import * as React from "react";
import * as PropTypes from "prop-types";
import cn from "classnames";

/**
 * A union of the available text container sizes. One of these values must be chosen
 * to help set the max width for text.
 */
export type TextContainerSize = "auto" | "mobile" | "desktop";

/**
 * The default additional props that can be provided to the `TextContainer`. By default, it is just
 * all the div element attributes.
 */
export type DefaultTextContainerProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * A type describing the text container's children render function. It provides an object containing
 * the correct (and merged) className and exects a renderable element to be returned.
 */
export type TextContainerRenderFunction = (props: { className: string }) => React.ReactNode;

/**
 * The base props for rendering the text component.
 *
 * @typeparam P - Any additional props that are available based on the component prop.
 */
export interface ITextContainerProps<P = DefaultTextContainerProps> {
  /**
   * An optional className to merge with typography text container styles.
   */
  className?: string;

  /**
   * The size for the text container. This can usually just be left at the default of `"auto"` since
   * it will automatically transition between `"mobile"` and `"desktop"` based on media queries.
   * However, you can also manually specify `"mobile"` or `"desktop"` if needed.
   */
  size?: TextContainerSize;

  /**
   * The component to render as. By default this will just be a div, but anything can be provided.
   */
  component?: React.ReactType<P>;

  /**
   * Either a child render function or a react node. If this is not the child render function, a
   * different wrapper component can be provided using the `component` prop.
   */
  children?: React.ReactNode | TextContainerRenderFunction;
}

/**
 * The default defined props for the text container component.
 */
export interface ITextContainerDefaultProps {
  size: TextContainerSize;
  component: React.ReactType;
}

/**
 * @private
 */
export type TextContainerWithDefaultProps = ITextContainerProps<DefaultTextContainerProps> &
  ITextContainerDefaultProps;

/**
 * The `TextContainer` component is a simple wrapper around a `<div>`, `<section>`, `<article>`, or
 * `<aside>` element that applies the text container styles.
 *
 * @typeparam P - Any additional props that can be provided to the `TextContainer` component. By
 * default, this will just be the HTMLAttributes of an HTML Element.
 */
export default class TextContainer<
  P extends {} = DefaultTextContainerProps
> extends React.Component<ITextContainerProps<P> & P> {
  public static propTypes = {
    size: PropTypes.oneOf(["auto", "mobile", "desktop"]),
    className: PropTypes.string,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.object]),
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  };

  public static defaultProps = {
    size: "auto",
    component: "div",
  } as ITextContainerDefaultProps;

  public render() {
    const { size, className: propClassName, component, children, ...props } = this
      .props as TextContainerWithDefaultProps;

    const className = cn(
      "rmd-text-container",
      {
        "rmd-text-container--mobile": size === "mobile",
        "rmd-text-container--desktop": size === "desktop",
      },
      propClassName
    );
    if (typeof children === "function") {
      return (children as TextContainerRenderFunction)({ className });
    }

    const Component = component as React.ReactType<P>;
    return (
      <Component {...props} className={className}>
        {children}
      </Component>
    );
  }
}
