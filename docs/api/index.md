# ScrollRect

滚动区域主体组件。

## Props

| 属性 | 描述 | 类型 | 默认值 |
| :----: | :----: | :----: | :----: |
| scroll | <div style="min-width:150px">滚动方向设置</div> | `'both'│'none'│'vertical'│'horizontal'` | `'both'` |
| scrollBarAlwaysShow | 是否保持滚动条常显示 | `boolean` | `false` |
| scrollBarBackgroundClickable | 是否可以点击滚动条其他区域来跳转滚动位置 | `boolean` | `false` |
| containerClass | 内部容器的自定义类 | `string` | - |

## Events

| 事件名 | 描述 | 参数 |
| :----: | :----: | :----: |
| scroll | 容器发生滚动时触发此事件 | `scrollLeft`, `scrollTop` |

## Slots

| 插槽名 | 描述 | 参数 |
| :----: | :----: | :----: |
| scrollBarX | 水平滚动条 | `ScrollRectScrollBarSlotParams` |
| scrollBarY | 垂直滚动条 | `ScrollRectScrollBarSlotParams` |

### ScrollRectScrollBarSlotParams

```js
{ scrollValue, onScroll }
```

scrollBarValue 结构如下：

|名字|类型|类型|
|----|----|----|
|show|boolean|是否显示滚动条|
|size|number|滚动条计算长度（百分比，0-100）|
|sizeRaw|number|滚动条计算长度（像素）|
|pos|number|滚动条滚动位置（百分比，0-100）|

onScroll 结构如下：

|参数|类型|
|----|----|
|pos|number|滚动条滚动位置回传（百分比，0-100）|

## ScrollRectInstance

组件接口，表示组件导出方法的实例。

你可以使用 `(this.$refs.myScrollBar as ScrollRectInstance)` 或者 `const myScrollBar = ref<ScrollRectInstance>()` 来使用。

### `scrollTo(x: number, y: number): void`

  滚动到指定位置。

  | 参数 | 说明 |
  | :----: | :----: |
  | x | x轴滚动参数 |
  | y | y轴滚动参数 |

### `scrollToTop(): void`

  滚动到顶部。

### `scrollToBottom(): void`

  滚动到底部。

### `getScrollContainer(): HTMLElement | undefined`

  获取内部滚动容器元素，可以获取他的 `scrollTop` 和 `scrollLeft` 来获取滚动数值或者控制滚动。

  返回值

  | 说明 |
  | :----: |
  | 容器元素 |

### `refreshScrollState(): void`

  强制刷新滚动条状态。如果滚动条状态未更新，你可以调用此方法来强制刷新。
