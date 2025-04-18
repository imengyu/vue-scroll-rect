# ScrollRect

Main component of the scroll area.

## Props

| Name | Desc | Type | Default value |
| :----: | :----: | :----: | :----: |
| scroll | <div style="min-width:150px">Scroll direction</div> | `'both'│'none'│'vertical'│'horizontal'` | `'both'` |
| scrollBarAlwaysShow | Show scroll bar always, otherwise show scroll bar when mouse over | `boolean` | `false` |
| scrollBarBackgroundClickable | Is able to click scroll bar background to set scroll position? (When `scrollBarAlwaysShow` is true) | `boolean` | `false` |
| containerClass | CSS class of inner container | `string` | - |

## Events

| Name | Desc | Params |
| :----: | :----: | :----: |
| scroll | This event is triggered when the container scrolls. | `scrollLeft`, `scrollTop` |
| resized | This event is triggered when the container content size changes. | `scrollWidth`, `scrollHeight` |

## Slots

| Name | Desc | Params |
| :----: | :----: | :----: |
| scrollBarX | Horizontal scroll bar | `ScrollRectScrollBarSlotParams` |
| scrollBarY | Vertical scroll bar | `ScrollRectScrollBarSlotParams` |

### ScrollRectScrollBarSlotParams

```js
{ scrollValue, onScroll }
```

Interface scrollBarValue:

|Name|Type|Desc|
|----|----|----|
|show|boolean|Is scrollbar visible? |
|size|number|Scroll bar calculation length (percentage, 0-100)|
|sizeRaw|number|Scroll bar calculation length (pixel)|
|pos|number|Scroll bar scrolling position (percentage, 0-100)|

Function onScroll:

|Param|Name|Type|
|----|----|----|
|pos|number|Scroll bar scrolling position callback (percentage, 0-100)|

## ScrollRectInstance

Component interface, representing an instance of the component export method.

You can use `(this.$refs.myScrollBar as ScrollRectInstance)` or `const myScrollBar = ref<ScrollRectInstance>()` to reference component instance.

### `scrollTo(x: number, y: number): void`

  Scroll to position.

  | Name | Desc |
  | :----: | :----: |
  | x | X scroll pos (pixel) |
  | y | Y scroll pos (pixel) |

### `scrollToTop(): void`

  Scroll to top.

### `scrollToBottom(): void`

  Scroll to bottom.

### `getScrollContainer(): HTMLElement | undefined`

  To obtain the internal scrolling container element, you can retrieve its `scrollTop` and `scrollLeft` to obtain scrolling values or control scrolling.

  Returns

  | Desc |
  | :----: |
  | Container |

### `refreshScrollState(): void`

  Force refresh of scrollbar status. If the scrollbar status is not updated, you can call this method to force a refresh.
