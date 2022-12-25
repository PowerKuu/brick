import "./standard.css"

import backboneStyle from "./backbone.module.css"
import bricksStyle from "./bricks.module.css"

import { JSX } from "solid-js/jsx-runtime"

import { merge } from "lodash"

// For link element
import router, { parseUrl } from "@klevn/solid-router"

export enum Category {
  Text = "categoryText",
  TextChild = "categoryTextChild",
  Layout = "categoryLayout",
  Image = "categoryImage",
  Video = "categoryVideo",
}

export enum Brick {
  Heading = "heading",
  SubHeading = "subHeading",
  Text = "text",
  Bold = "bold",
  Link = "link",
  Image = "image",
  ImageAdaptive = "imageAdaptive",
  ImageContainer = "imageContainer",
  Video = "video",
  VideoEmbed = "videoEmbed",
  Container = "container",
  VerticalLayout = "verticalLayout",
  HorizontalLayout = "horizontalLayout",
  WrapLayout = "wrapLayout",
  FixedWrapLayout = "fixedWrapLayout",
}

type Position = "start" | "center" | "end" | "stretch"

type BrickProps<T extends {}> = {
  children?: JSX.Element
  customStyle?: JSX.CSSProperties
  classList?: string[]
} & T
type LayoutProps<T extends {}> = BrickProps<
  {
    gap?: number
    curve?: number
    background?: string
    align?: Position
    justify?: Position
  } & T
>
type TextProps<T extends {}> = BrickProps<{ color?: string } & T>

interface Config {
  globalStyle: JSX.CSSProperties

  theme: {
    [key in Brick]?: JSX.CSSProperties
  }
}

interface PartialConfig {
  globalStyle?: JSX.CSSProperties

  theme?: {
    [key in Brick]?: JSX.CSSProperties
  }
}

const defaultAlign: Position = "stretch"
const defaultJustify: Position = "start"

const defaultConfig: Config = {
  globalStyle: {},
  theme: {},
}

const alignClasses = {
  start: backboneStyle.alignStart,
  center: backboneStyle.alignCenter,
  end: backboneStyle.alignEnd,
  stretch: backboneStyle.alignStretch,
}

const justifyClasses = {
  start: backboneStyle.justifyStart,
  center: backboneStyle.justifyCenter,
  end: backboneStyle.justifyEnd,
  stretch: backboneStyle.justifyStretch,
}

function staticRem(input: number) {
  return input * 16
}

export default function createBricks(config: PartialConfig = {}) {
  const safeConfig: Config = merge(defaultConfig, config) as Config

  function createClassList(classList: string[]) {
    return [bricksStyle.brick, ...classList].join(" ")
  }

  function createStyle(...customStyle: JSX.CSSProperties[]): JSX.CSSProperties {
    console.log(customStyle)
    var styleSum: JSX.CSSProperties = {}

    for (var style of customStyle) {
      for (var [key, value] of Object.entries(style)) {
        if (value) (styleSum as any)[key] = value
      }
    }

    return {
      ...safeConfig.globalStyle,
      ...styleSum,
    }
  }

  function proccessProps(
    brick: Brick,
    category: Category,
    props: BrickProps<any>,
    style: JSX.CSSProperties
  ) {
    const classList = [
      ...(props.classList ?? []),
      bricksStyle[brick],
      backboneStyle[category],

      alignClasses[(props.align ?? defaultAlign) as Position],
      justifyClasses[(props.justify ?? defaultJustify) as Position],
    ]

    return {
      classList: createClassList(classList),

      style: createStyle(
        props.customStyle ?? {},
        safeConfig.theme?.[brick] ?? {},
        style
      ),
    }
  }

  return {
    Heading(props: TextProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.Heading,
        Category.Text,
        props,
        {
          color: props.color,
        }
      )

      return (
        <h1>
          <pre style={style} class={classList}>
            {props.children}
          </pre>
        </h1>
      )
    },

    SubHeading(props: TextProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.SubHeading,
        Category.Text,
        props,
        {
          color: props.color,
        }
      )

      return (
        <h2>
          <pre style={style} class={classList}>
            {props.children}
          </pre>
        </h2>
      )
    },

    Text(props: TextProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.Text,
        Category.Text,
        props,
        {
          color: props.color,
        }
      )

      return (
        <p style={style} class={classList}>
          {props.children}
        </p>
      )
    },

    Bold(props: BrickProps<{ weight?: number, color?: string }>) {
      const { style, classList } = proccessProps(
        Brick.Bold,
        Category.TextChild,
        props,
        {
          color: props.color,

          "font-weight": props.weight ?? "bolder",
        }
      )

      return (
        <span style={style} class={classList}>
          {props.children}
        </span>
      )
    },

    Link(props: BrickProps<{ href: string, color?: string }>) {
      const { style, classList } = proccessProps(
        Brick.Link,
        Category.TextChild,
        props,
        {
          color: props.color ?? "#0000ff",
        }
      )

      const onclick = (event: Event) => {
        event.preventDefault()

        const parsed = parseUrl(props.href)
        if ((parsed as any)["parse_failed"])
          throw Error("Cannot find " + props.href)

        if (parsed.resource == router.currentUrl?.resource) {
          router.update(props.href)
        } else {
          router.redirect(props.href)
        }
      }

      return (
        <a onclick={onclick} href={props.href} style={style} class={classList}>
          {props.children}
        </a>
      )
    },

    Image(
      props: BrickProps<{
        src: string
        width: number
        height: number
        alt?: string
      }>
    ) {
      const { style, classList } = proccessProps(
        Brick.Image,
        Category.Image,
        props,
        {
          width: `${staticRem(props.width)}px`,
          height: `${staticRem(props.width)}px`,
        }
      )

      return (
        <img style={style} class={classList} src={props.src} alt={props.alt} />
      )
    },

    ImageAdaptive(props: BrickProps<{ src: string, alt?: string }>) {
      const { style, classList } = proccessProps(
        Brick.ImageAdaptive,
        Category.Image,
        props,
        {}
      )

      return (
        <div class={classList}>
          <img style={style} src={props.src} alt={props.alt} />
        </div>
      )
    },

    ImageContainer(props: BrickProps<{ src: string }>) {
      const { style, classList } = proccessProps(
        Brick.ImageContainer,
        Category.Image,
        props,
        {
          "background-image": `url("${props.src}")`,
        }
      )

      return <div style={style} class={classList}></div>
    },

    Video(
      props: BrickProps<{
        src: string
        controls?: boolean
        autoplay?: boolean
        muted?: boolean
      }>
    ) {
      const { style, classList } = proccessProps(
        Brick.Video,
        Category.Video,
        props,
        {}
      )

      return (
        <video
          style={style}
          class={classList}
          controls={props.controls}
          muted={props.muted}
          autoplay={props.autoplay}
          src={props.src}
        ></video>
      )
    },

    VideoEmbed(props: BrickProps<{ embed: string, allow?: string }>) {
      const { style, classList } = proccessProps(
        Brick.VideoEmbed,
        Category.Video,
        props,
        {}
      )

      return (
        <iframe
          style={style}
          class={classList}
          src={props.embed}
          title="Video player"
          allow={
            props.allow ??
            "accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
          }
          allowfullscreen
        ></iframe>
      )
    },

    ContainerResponsive(
      props: LayoutProps<{
        verticalPadding?: number
        horizontalPadding?: number
      }>
    ) {
      const { style, classList } = proccessProps(
        Brick.Container,
        Category.Layout,
        props,
        {
          gap: `${props.gap}rem`,
          "background-color": props.background,
          "border-radius": `${props.curve}px`,

          "padding-top": `${props.verticalPadding}vw`,
          "padding-bottom": `${props.verticalPadding}vw`,
          "padding-left": `${props.horizontalPadding}vw`,
          "padding-right": `${props.horizontalPadding}vw`,
        }
      )

      return (
        <div style={style} class={classList}>
          {props.children}
        </div>
      )
    },

    VerticalLayout(props: LayoutProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.VerticalLayout,
        Category.Layout,
        props,
        {
          gap: `${props.gap}rem`,
          "background-color": props.background,
          "border-radius": `${props.curve}px`,
        }
      )

      return (
        <div style={style} class={classList}>
          {props.children}
        </div>
      )
    },

    HorizontalLayout(props: LayoutProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.HorizontalLayout,
        Category.Layout,
        props,
        {
          gap: `${props.gap}rem`,
          "background-color": props.background,
          "border-radius": `${props.curve}px`,
        }
      )

      return (
        <div
          style={{
            ...style,
            gap: `${props.gap}rem`,
            "background-color": props.background,
            "border-radius": `${props.curve}px`,
          }}
          class={classList}
        >
          {props.children}
        </div>
      )
    },

    WrapLayout(props: LayoutProps<{}>) {
      const { style, classList } = proccessProps(
        Brick.WrapLayout,
        Category.Layout,
        props,
        {
          gap: `${props.gap}rem`,
          "background-color": props.background,
          "border-radius": `${props.curve}px`,
        }
      )

      return (
        <div style={style} class={classList}>
          {props.children}
        </div>
      )
    },

    FixedWrapLayout(props: LayoutProps<{ wrap: number }>) {
      let ref: any
      var observer = window.matchMedia(`(max-width: ${props.wrap}px)`)

      const { style, classList } = proccessProps(
        Brick.FixedWrapLayout,
        Category.Layout,
        props,
        {
          gap: `${props.gap}rem`,
          "background-color": props.background,
          "border-radius": `${props.curve}px`,
          "flex-direction": observer.matches ? "column" : "row",
        }
      )

      observer.addEventListener("change", () => {
        if (observer.matches) ref.style["flex-direction"] = "column"
        else ref.style["flex-direction"] = "row"
      })

      return (
        <div ref={ref} style={style} class={classList}>
          {props.children}
        </div>
      )
    },
  }
}
