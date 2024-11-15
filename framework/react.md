# React Hooks

## 📀 视频学习

[https://www.bilibili.com/video/BV1sV411c7u9/?spm_id_from=333.976.0.0]

## 1. 准备工作

**步骤1：** 基于 `Vite` 创建 `React + TypeScript` 的项目，具体创建项目的步骤，请参考 [Vite 官方文档](https://vitejs.cn/vite3-cn/guide/)。

**步骤2**：在 `Vite` 项目中配置 `@ `路径提示：

2.1 安装 `node` 的类型声明：

> [!TIP]
>
> `pnpm i -D @types/node`

2.2 配置 `vite.config.ts` 文件：

```tsx
// 1. 以 ES6 模块化的方式，从 Node 的 path 模块中，导入 join 函数
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 2. 在 resolve.alias 对象下，配置 @ 的指向路径
  resolve: {
    alias: {
      '@': join(__dirname, './src/')
    }
  }
}) 
```

**步骤3：**配置 `tsconfig.json` 文件，在 `compilerOptions ` 节点下，新增 `"baseUrl": "."` 和 `"paths": { "@/*": [ "src/*" ] } `两项：

```json
{
  "compilerOptions": {
    /* 新增以下两个配置项，分别是 baseUrl 和 paths */
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": [
      "ES2020",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "src"
  ],
  "references": [
    {
      "path": "./tsconfig.node.json"
    }
  ]
} 
```

## 2. useState

### 1. 基本用法

**useState**，能让函数组件拥有自己的状态，因此，它是一个管理状态的 `hooks API`。通过 `useState` 可以实现状态的初始化、读取、更新。基本语法格式如下：

```ts
const [状态名, set函数] = useState(初始值)
```

其中：状态名所代表的数据，可以被函数组件使用；如果要修改状态名所代表的数据，需要调用 `set` 函数 进行修改。

```tsx
import { useState } from 'react'

export function Count() {
  // 定义状态 count，其初始值为 0
  // 如果要修改 count 的值，需要调用 setCount(新值) 函数
  const [count, setCount] = useState(0)

  return (
    <>
      <!-- 在函数组件内，使用名为 count 的状态 -->
      <h1>当前的 count 值为：{count}</h1>
      <!-- 点击按钮时，调用 setCount() 函数，为 count 赋新值 -->
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  )
} 
```

### 2. 状态变化时，会触发函数组件的重新执行

在函数组件中使用 `setState` 定义状态之后，每当状态发生变化，都会触发函数组件的重新执行，从而根据最新的数据更新渲染 `DOM` 结构。例如：

```tsx
import { useState } from 'react'

export function Count() {
  // 定义状态 count，其初始值为 0
  // 如果要修改 count 的值，需要调用 setCount(新值) 函数
  const [count, setCount] = useState(0)

  // 每次 count 值发生变化，都会打印下面的这句话：
  console.log('组件被重新渲染了')

  const add = () => {
    setCount(count + 1)
  }

  return (
    <>
      <!-- 在函数组件内，使用名为 count 的状态 -->
      <h1>当前的 count 值为：{count}</h1>
      <!-- 点击按钮时，在 add 处理函数中，调用 setCount() 函数，为 count 赋新值 -->
      <button onClick={add}>+1</button>
    </>
  )
} 
```

> [!IMPORTANT]
>
> 注意：当函数式组件被重新执行时，不会重复调用 `useState()` 给数据赋初值，而是会复用上次的 `state` 值。

### 3. 以函数的形式为状态赋初始值

在使用 `useState` 定义状态时，除了可以直接给定初始值，还可以通过函数返回值的形式，为状态赋初始值，语法格式如下：

```ts
const [value, setValue] = useState(() => 初始值)
```

例如：

```tsx
export const DateCom: React.FC = () => {
  // const [date] = useState({ year: 2023, month: 9, day: 11 })
  const [date, setDate] = useState(() => {
    const dt = new Date()
    return { year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() }
  })

  return (
    <>
      <h1>今日信息：</h1>
      <p>年份：{date.year}年</p>
      <p>月份：{date.month}月</p>
      <p>日期：{date.day}日</p>
    </>
  )
}
```

> [!IMPORTANT]
>
> 注意：以函数的形式为状态赋初始值时，只有组件首次被渲染才会执行 `fn` 函数；当组件被更新时，会以更新前的值作为状态的初始值，赋初始值的函数不会执行。

### 4. useState 是异步变更状态的

调用 `useState()` 会返回一个变更状态的函数，这个函数内部是以异步的形式修改状态的，所以修改状态后无法立即拿到最新的状态，例如：

```tsx
export const Count: React.FC = () => {
  const [count, setCount] = useState(() => 0)

  const add = () => {
    // 1. 让数值自增+1
    setCount(count + 1)
    // 2. 打印 count 的值
    console.log(count)
  }

  return (
    <>
      <h1>当前的 count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
}
```

在上述代码的第 `8`行，打印出来的 `count` 值是更新前的旧值，而非更新后的新值。证明 `useState` 是异步变更状态的。

### 5. 结合 useEffect 监听状态的变化

为了能够监听到状态的变化，`react` 提供了 `useEffect` 函数。它能够监听依赖项状态的变化，并执行对应的回调函数。基本语法格式如下：

```tsx
useEffect(() => { /* 依赖项变化时，要触发的回调函数 */ }, [依赖项])
```

例如：

```tsx
export const Count: React.FC = () => {
  const [count, setCount] = useState(() => 0)

  const add = () => {
    setCount(count + 1)
  }

  // 当 count 变化后，会触发 useEffect 指定的回调函数
  useEffect(() => {
    console.log(count)
  }, [count])

  return (
    <>
      <h1>当前的 count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
} 
```

### 6. 注意事项

#### 6.1 更新对象类型的值

如果要更新对象类型的值，并触发组件的重新渲染，则必须使用展开运算符或 `Object.assign()` 生成一个新对象，用新对象覆盖旧对象，才能正常触发组件的重新渲染。示例代码如下：

```tsx
export const UserInfo: React.FC = () => {
  const [user, setUser] = useState({
    name: 'zs',
    age: 12,
    gender: '男'
  })

  const updateUserInfo = () => {
    // user.name = 'Jesse Pinkman'
    // 下面的写法是错误的，因为 set 函数内部，会对更新前后的值进行对比；
    // 由于更新前后的 user，原值的引用和新值的引用相同，
    // 所以 react 认为值没有发生变化，不会触发组件的重新渲染。
    // setUser(user)

    // 解决方案：用新对象的引用替换旧对象的引用，即可正常触发组件的重新渲染。
    // setUser({ ...user })
    // setUser(Object.assign({}, user))
    // 通常在实际开发中，经常结合【展开运算符 + 属性值覆盖】的形式更新对象的属性值：
    setUser({...user, name: 'Jesse Pinkman'})
  }

  return (
    <>
      <h1>用户信息：</h1>
      <p>姓名：{user.name}</p>
      <p>年龄：{user.age}</p>
      <p>性别：{user.gender}</p>

      <button onClick={updateUserInfo}>更新用户信息</button>
    </>
  )
} 
```

#### 6.2 解决值更新不及时的 Bug

当连续多次以相同的操作更新状态值时，`React` 内部会对传递过来的新值进行比较，如果值相同，则会屏蔽后续的更新行为，从而防止组件频繁渲染的问题。这虽然提高了性能，但也带来了一个使用误区，例如：

```tsx
export const Count: React.FC = () => {
  const [count, setCount] = useState(() => 0)

  const add = () => {
    // 1. 希望让 count 值从 0 自增到 1
    setCount(count + 1)
    // 2. 希望让 count 值从 1 自增到 2
    setCount(count + 1)
  }

  return (
    <>
      <h1>当前的 count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
} 
```

经过测试，我们发现上述代码执行的结果，只是让 `count` 从 `0` 变成了 `1`，最终的 `count` 值并不是 ` 2`。`Why？`

因为 `setCount `是异步地更新状态值的，所以前后两次调用 `setCount  `传递进去的新值都是 `1`。`React` 内部如果遇到两次相同的状态，则会默认阻止组件再次更新。

为了解决上述的问题，我们可以使用函数的方式给状态赋新值。当函数执行时才通过函数的形参，拿到当前的状态值，并基于它返回新的状态值。示例代码如下：

```tsx
export const Count: React.FC = () => {
  const [count, setCount] = useState(() => 0)

  const add = () => {
    // 传递了更新状态的函数进去
    setCount((c) => c + 1)
    setCount((c) => c + 1)
  }

  return (
    <>
      <h1>当前的 count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
} 
```

#### 6.3 使用 setState 模拟组件的强制刷新

在函数组件中，我们可以通过 `useState` 来模拟 `forceUpdate` 的强制刷新操作。因为只要 `useState` 的状态发生了变化，就会触发函数组件的重新渲染，从而达到强制刷新的目的。具体的代码示例如下：

```tsx
export const FUpdate: React.FC = () => {
  const [, forceUpdate] = useState({})

  // 每次调用 onRefresh 函数，都会给 forceUpdate 传递一个新对象
  // 从而触发组件的重新渲染
  const onRefresh = () => forceUpdate({})

  return (
    <>
      <button onClick={onRefresh}>点击强制刷新 --- {Date.now()}</button>
    </>
  )
}
```

> [!TIP]
>
> 注意：因为每次传入的对象的地址不同，所以一定会使组件刷新。

## 3. useRef

### 1. useRef 的两个主要作用

`useRef` 函数返回一个可变的 `ref` 对象，该对象只有一个 `current` 属性。可以在调用 `useRef` 函数时为其指定初始值。并且这个返回的 `ref `对象在组件的整个生命周期内保持不变。语法格式如下：

```tsx
// 1. 导入 useRef
import { useRef } from 'react'
// 2. 调用 useRef 创建 ref 对象
const refObj = useRef(初始值)
// 3. 通过 ref.current 访问 ref 中存储的值
console.log(refObj.current)
```

useRef 函数用来解决以下两个问题：

> [!IMPORTANT]
>
> 1. 获取 DOM 元素或子组件的实例对象；
> 2. 存储渲染周期之间共享的数据；

### 2. 获取 DOM 元素的实例

下面的代码演示了如何获取 `Input` 元素的实例，并调用其 `DOM API`：

```tsx
import React, { useRef } from 'react'

export const InputFocus: React.FC = () => {
  // 1. 创建 ref 引用
  const iptRef = useRef<HTMLInputElement>(null)

  const getFocus = () => {
    // 3. 调用 focus API，让文本框获取焦点
    iptRef.current?.focus()
  }

  return (
    <>
      {/* 2. 绑定 ref 引用 */}
      <input type="text" ref={iptRef} />
      <button onClick={getFocus}>点击获取焦点</button>
    </>
  )
} 
```

### 3. 存储渲染周期之间的共享数据

基于 `useRef` 创建名为 `prevCountRef`的数据对象，用来存储上一次的旧 `count` 值。每当点击按钮触发 `count` 自增时，都把最新的旧值赋值给 `prevCountRef.current` 即可：

```tsx
export const Counter: React.FC = () => {
  // 默认值为 0
  const [count, setCount] = useState(0)

  // 默认值为 undefined
  const prevCountRef = useRef<number>()

  const add = () => {
    // 点击按钮时，让 count 值异步 +1
    setCount((c) => c + 1)
    // 同时，把 count 所代表的旧值记录到 prevCountRef 中
    prevCountRef.current = count
  }

  return (
    <>
      <h1>
        新值是：{count}，旧值是：{prevCountRef.current}
      </h1>
      <button onClick={add}>+1</button>
    </>
  )
}
```

### 4. 注意事项

#### 4.1 组件 rerender 时 useRef 不会被重复初始化

在 `RefTimer` 组件中，点击 `+1` 按钮，会让 `count`值自增，从而触发 `RefTimer` 组件的 `rerender`。

但是，我们发现 `RefTimer` 组件中的时间戳保持不变，这说明组件每次渲染，不会重复调用 `useRef` 函数进行初始化。示例代码如下：

```tsx
  const [count, setCount] = useState(0)
  const time = useRef(Date.now())

  console.log('组件被渲染了')

  return (
    <>
      <h3>
        count值是：{count}, 时间戳是：{time.current}
      </h3>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
    </>
  )
}
```

#### 4.2 ref.current 变化时不会造成组件的 rerender

点击给 `ref` 赋新值的按钮时，为 `time.current` 赋新值，执行的结果是：

> [!IMPORTANT]
>
> 1. 终端中输出了最新的 `time.current` 的值
> 2. 没有触发 `RefTimer` 组件的 `rerender`

这证明了 `ref.current` 变化时不会造成组件的 `rerender`，示例代码如下：

```tsx
export const RefTimer: React.FC = () => {
  const [count, setCount] = useState(0)
  const time = useRef(Date.now())

  const updateTime = () => {
    time.current = Date.now()
    console.log(time.current)
  }

  console.log('组件被渲染了')

  return (
    <>
      <h3>
        count值是：{count}, 时间戳是：{time.current}
      </h3>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={updateTime}>给ref赋新值</button>
    </>
  )
}
```

#### 4.3 ref.current 不能作为其它 Hooks 的依赖项

由于 `ref.current` 值的变化不会造成组件的 `rerender`，而且 `React` 也不会跟踪 `ref.current` 的变化，因此 `ref.current` 不可以作为其它 `hooks（useMemo、useCallback、useEffect 等）` 的依赖项。

```tsx
export const RefTimer: React.FC = () => {
  const [count, setCount] = useState(0)
  const time = useRef(Date.now())

  const updateTime = () => {
    time.current = Date.now()
    console.log(time.current)
  }

  console.log('组件被渲染了')

  useEffect(() => {
    console.log('time 的值发生了变化：' + time.current)
  }, [time.current])

  return (
    <>
      <h3>
        count值是：{count}, 时间戳是：{time.current}
      </h3>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={updateTime}>给ref赋新值</button>
    </>
  )
}
```

在上面的代码中，组件首次渲染完成后，必然会触发一次 `useEffect` 的执行。但是，当 `time.current` 发生变化时，并不会触发 `useEffect` 的重新执行。因此，不能把 `ref.current`作为其它 `hooks`的依赖项。

## 4. forwardRef

`ref` 的作用是获取实例，但由于函数组件不存在实例，因此无法通过 `ref` 获取函数组件的实例引用。而 `React.forwardRef` 就是用来解决这个问题的。

`React.forwardRef` 会创建一个 `React` 组件，这个组件能够将其接收到的 `ref` 属性转发到自己的组件树。

### 1. 无法直接使用 ref 引用函数式组件

在下面的例子中，父组件 `Father` 想通过 `ref` 引用子组件 `Child`，此时代码会报错，因为函数式组件没有实例对象，无法被直接引用：

```tsx
// 父组件
export const Father: React.FC = () => {
  const childRef = useRef()

  return (
    <>
      <h1>Father 父组件</h1>
      <hr />
      <!-- 下面这行代码中的 ref 使用不正确，因为 Child 组件是函数式组件，无法被直接引用 -->
      <Child ref={childRef} />
    </>
  )
} 
```

`Child` 组件的定义如下：

```tsx
// 子组件（实现点击按钮，数值加减的操作）
const Child: React.FC = () => {
  const [count, setCount] = useState(0)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
    </>
  )
}
```

注意：上面的代码无法正常运行，会在终端提示如下的 Warning 警告：

> [!WARNING]
>
> Warning:
> Function components cannot be given refs. Attempts to access this ref will fail.
> Did you mean to use React.forwardRef()?

> [!TIP]
>
> 错误提示中有解决此问题的关键提示：Did you mean to use **React.forwardRef()**?

### 2. forwardRef 的基本使用

在使用函数组件时，我们无法直接使用 `ref` 引用函数式组件，下面的代码会产生报错：

```tsx
const childRef = useRef(null)
return <Child ref={inputRef} /> 
```

因为默认情况下，你自己的组件不会暴露它们内部 `DOM` 节点的 `ref`。

正确的方法是使用 `React.forwardRef()` 把函数式组件包装起来，例如 `Child` 子组件的代码如下：

```tsx
// 被包装的函数式组件，第一个参数是 props，第二个参数是转发过来的 ref
const Child = React.forwardRef((props, ref) => {
  // 省略子组件内部的具体实现
})
```

然后，在父组件 `Father` 中，就可以给子组件 `Child` 绑定 `ref `了：

```tsx
// 父组件
export const Father: React.FC = () => {
  const childRef = useRef()

  // 按钮的点击事件处理函数
  const onShowRef = () => {
    console.log(childRef.current)
  }

  return (
    <>
      <h1>Father 父组件</h1>
      {/* 点击按钮，打印 ref 的值 */}
      <button onClick={onShowRef}>show Ref</button>
      <hr />
      <Child ref={childRef} />
    </>
  )
}
```

> [!IMPORTANT]
>
> 注意：此时父组件 `Father` 中获取到的 `ref.current` 是 `null`，因为子组件 `Child` 没有向外暴露任何自己内部的东西。

## 5. useImperativeHandle

直接使用 `ref` 获取 `DOM` 实例，会全面暴露 `DOM` 实例上的 `API`，从而导致外部使用 `ref` 时有更大的自由度。在实际开发中，我们应该严格控制 `ref` 的暴露颗粒度，控制它能调用的方法，只向外暴露主要的功能函数，其它功能函数不暴露。

`React` 官方提供 `useImperativeHandle` 的目的，就是让你在使用 `ref` 时可以自定义暴露给外部组件哪些功能函数或属性。

它的语法结构如下：

```tsx
useImperativeHandle(通过forwardRef接收到的父组件的ref对象, () => 自定义ref对象, [依赖项数组])
```

其中，第三个参数（依赖项数组）是可选的。

### 1. useImperativeHandle 的基本使用

在被 `React.forwardRef()` 包裹的组件中，需要结合 `useImperativeHandle` 这个 `hooks API`，向外按需暴露子组件内的成员：

```tsx
import React, { useRef, useState, useImperativeHandle } from 'react'

// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 1. 向外暴露一个空对象
  // 2. useImperativeHandle(ref, () => ({}))
  // 向外暴露一个对象，其中包含了 name 和 age 两个属性
  useImperativeHandle(ref, () => ({
    name: 'liulongbin',
    age: 22
  }))

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
    </>
  )
})
```

### 2. 基于 useImperativeHandle 按需向外暴露成员

在子组件中，向外暴露 `count` 和 `setCount` 这两个成员：

```tsx
// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 向外暴露 count 的值和 setCount 函数
  useImperativeHandle(ref, () => ({
    count,
    setCount
  }))

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
    </>
  )
})
```

在父组件中，添加一个重置按钮，当点击重置按钮时，调用 `ref` 向外暴露的 `setCount` 函数，把子组件内部的 `count` 重置为 `0`。示例代码如下：

```tsx
// 父组件
export const Father: React.FC = () => {
  const childRef = useRef<{ count: number; setCount: (value: number) => void }>(null)

  // 按钮的点击事件处理函数
  const onShowRef = () => {
    console.log(childRef.current)
  }

  // 重置按钮的点击事件处理函数
  const onReset = () => {
    childRef.current?.setCount(0)
  }

  return (
    <>
      <h1>Father 父组件</h1>
      {/* 点击按钮，打印 ref 的值 */}
      <button onClick={onShowRef}>show Ref</button>
      {/* 点击按钮，重置数据为 0 */}
      <button onClick={onReset}>重置</button>
      <hr />
      <Child ref={childRef} />
    </>
  )
}
```

### 3. 控制成员暴露的粒度

在 `Child` 子组件中，我们希望对外暴露一个重置 `count` 为 `0` 的函数，而不希望直接把 `setCount()` 暴露出去，因为父组件调用 `setCount()` 时可以传任何数值。因此，我们可以基于 `useImperativeHandle`，向外提供一个 `reset()` 函数而非直接把 `setCount()` 暴露出去：

```tsx
// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 向外暴露 count 的值和 reset 函数
  useImperativeHandle(ref, () => ({
    count,
    // 在组件内部封装一个重置为 0 的函数，API 的粒度更小
    reset: () => setCount(0)
  }))

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
    </>
  )
}) 
```

在父组件中，调用 `ref.current.reset()` 即可把数据重置为 `0`：

```tsx
// 父组件
export const Father: React.FC = () => {
  const childRef = useRef<{ count: number; reset: () => void }>(null)

  // 按钮的点击事件处理函数
  const onShowRef = () => {
    console.log(childRef.current)
  }

  // 重置按钮的点击事件处理函数
  const onReset = () => {
    childRef.current?.reset()
  }

  return (
    <>
      <h1>Father 父组件</h1>
      {/* 点击按钮，打印 ref 的值 */}
      <button onClick={onShowRef}>show Ref</button>
      {/* 点击按钮，重置数据为 0 */}
      <button onClick={onReset}>重置</button>
      <hr />
      <Child ref={childRef} />
    </>
  )
}
```

### 4. useImperativeHandle 的第三个参数

再来回顾一下 `useImperativeHandle` 的参数项：

```tsx
useImperativeHandle(ref, createHandle, [deps])
```

> [!TIP]
>
> 1. 第一个参数为父组件传递的 ref；
> 2. 第二个参数是一个函数，返回的对象会自动绑定到 ref 上。 即子组件可以将自己内部的方法或者值通过 `useImperativeHandle` 添加到父组件中 useRef 定义的对象中；
> 3. 第三个参数是**函数依赖的值**（可选）。若 createHandle 函数中**使用到了子组件内部定义的变量**，则还需要将该变量作为依赖变量成为 `useImperativeHandle` 的第3个参数；

其中，第三个参数有3种用法：

1. **空数组：**只在子组件首次被渲染时，执行 `useImperativeHandle` 中的 `fn` 回调，从而把 `return` 的对象作为父组件接收到的 `ref`。例如：

```tsx
import React, { useState, useImperativeHandle } from 'react'

// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 向外暴露 count 的值和 reset 函数
  useImperativeHandle(
    ref,
    () => {
      // 这个 console 只执行1次，哪怕 count 值更新了，也不会重新执行
      // 导致的结果是：外界拿到的 count 值，永远是组件首次渲染时的初始值 0
      console.log('执行了 useImperativeHandle 的回调')
      return {
        count,
        reset: () => setCount(0)
      }
    },
    []
  )

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
    </>
  )
})
```

2. **依赖项数组：**子组件首次被渲染时，会依赖项改变时，会执行 `useImperativeHandle` 中的 `fn` 回调，从而让父组件通过 `ref` 能拿到依赖项的新值。例如：

```tsx
import React, { useState, useImperativeHandle } from 'react'

// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 向外暴露 count 的值和 reset 函数
  useImperativeHandle(
    ref,
    () => {
      // 每当依赖项 count 值变化，都会触发这个回调函数的重新执行
      // 因此，父组件能拿到变化后的最新的 count 值
      console.log('执行了 useImperativeHandle 的回调')
      return {
        count,
        reset: () => setCount(0)
      }
    },
    // 注意：只有 count 值变化，才会触发回调函数的重新执行
    // flag 值的变化，不会导致回调函数的重新执行，因为 flag 没有被声明为依赖项
    [count]
  )

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <p>flag 的值是：{String(flag)}</p>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
      {/* 点击按钮，切换布尔值 */}
      <button onClick={() => setFlag((boo) => !boo)}>Toggle</button>
    </>
  )
}) 
```

3. **省略依赖项数组**（省略第三个参数）：此时，组件内任何 `state` 的变化，都会导致 `useImperativeHandle` 中的回调的重新执行。示例代码如下：

```tsx
import React, { useState, useImperativeHandle } from 'react'

// 子组件
const Child = React.forwardRef((_, ref) => {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  const add = (step: number) => {
    setCount((prev) => (prev += step))
  }

  // 向外暴露 count 的值和 reset 函数
  useImperativeHandle(ref, () => {
    // 只要组件内的任何 state 发生变化，都会触发回调函数的重新执行
    console.log('执行了 useImperativeHandle 的回调')
    return {
      count,
      reset: () => setCount(0)
    }
  })

  return (
    <>
      <h3>Child 子组件 {count}</h3>
      <p>flag 的值是：{String(flag)}</p>
      <button onClick={() => add(-1)}>-1</button>
      <button onClick={() => add(1)}>+1</button>
      {/* 点击按钮，切换布尔值 */}
      <button onClick={() => setFlag((boo) => !boo)}>Toggle</button>
    </>
  )
})
```

### 5. 使用 ref 时候的陷阱

陷阱1：**不要滥用 ref**。 你应当仅在你没法通过 `prop` 来表达 命令式 行为的时候才使用 `ref`：例如，滚动到指定节点、聚焦某个节点、触发一次动画，以及选择文本等等。

陷阱2：**如果可以通过 prop 实现，那就不应该使用 ref**。例如，你不应该从一个 `Model` 组件暴露出 `{open, close}` 这样的命令式句柄，最好是像 `<Modal isOpen={isOpen} />` 这样，将 `isOpen` 作为一个 `prop`。副作用可以帮你通过 `prop` 来暴露一些命令式的行为。

## 6. useEffect

### 1. 什么是函数的副作用

函数的副作用就是函数**除了返回值外**对**外界环境**造成的其它影响，即与组件渲染无关的操作。例如**获取数据、修改全局变量、更新 DOM** 等。

`useEffect` 是 `React` 中的 `hooks API`。通过 `useEffect` 可以执行一些副作用操作，例如：请求数据、事件监听等。它的语法格式如下：

```tsx
useEffect(fn, deps?) 
```

其中：

> [!TIP]
>
> 1. 第一个参数 `fn` 是一个副作用函数，该函数会在**每次渲染完成之后**被调用；
> 2. 第二个参数是**可选的依赖项数组**，这个数组中的每一项内容都会被用来进行**渲染前后的对比**
>
>    a. 当依赖项发生变化时，会重新执行 `fn` 副作用函数
>
>    b. 当依赖项没有任何变化时，则不会执行 `fn` 副作用函数

### 2. useEffect 的执行时机

如果没有为 `useEffect` 指定依赖项数组，则 `Effect` 中的副作用函数，会在函数组件每次渲染完成后执行。例如，我们在下面的代码中，基于 `useEffect` 获取 `h1` 元素最新的 `innerText`：

```tsx
import React, { useEffect, useState } from 'react'

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0)

  // 注意：这里每次输出的都是上一次的旧值
  // console.log(document.querySelector('h1')?.innerHTML)

  const add = () => {
    setCount((prev) => prev + 1)
  }

  // 在组件每次渲染完成之后，都会重新执行 effect 中的回调函数
  useEffect(() => {
    console.log(document.querySelector('h1')?.innerHTML)
  })

  return (
    <>
      <h1>count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
} 
```

### 3. deps 为空数组

如果为 useEffect 指定了一个空数组 `[]` 作为 deps 依赖项，则副作用函数只会在组件首次渲染完成后执行唯一的一次。

当组件 rerender 的时候不会触发副作用函数的重新执行。例如下面的代码中，useEffect 中的 `console.log()` 只会执行 `1`次：

```tsx
import React, { useEffect, useState } from 'react'

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0)

  const add = () => {
    setCount((prev) => prev + 1)
  }

  // 仅在组件首次渲染完成后，会执行 effect 中的回调函数
  useEffect(() => {
    console.log(document.querySelector('h1')?.innerHTML)
  }, [])

  return (
    <>
      <h1>count 值为：{count}</h1>
      <button onClick={add}>+1</button>
    </>
  )
} 
```

### 4. deps 为依赖项数组

如果想**有条件地**触发副作用函数的**重新执行**，则需要通过 `deps` 数组**指定依赖项列表**。

React 会在组件每次渲染完成后，对比渲染前后的每一个依赖项是否发生了变化，只要任何一个依赖项发生了变化，都会触发副作用函数的重新执行。否则，如果所有依赖项在渲染前后都没有发生变化，则不会触发副作用函数的重新执行。

下面的例子演示了依赖项的使用：只有当 `count` 值发生变化时，才会触发 `effect` 回调函数的重新执行，`flag` 值的变化不会触发：

```tsx
import React, { useEffect, useState } from 'react'

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  const add = () => {
    setCount((prev) => prev + 1)
  }

  // 在组件每次渲染完成后，如果 count 值发生了变化，则执行 effect 中的回调
  // 其它状态的变化，不会导致此回调函数的重新执行
  useEffect(() => {
    console.log(document.querySelector('h1')?.innerHTML)
  }, [count])

  return (
    <>
      <h1>count 值为：{count}</h1>
      <p>flag 的值为：{String(flag)}</p>
      <button onClick={add}>+1</button>
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
    </>
  )
} 
```

> [!CAUTION]
>
> 注意：**不建议**把**对象**作为 `useEffect` 的**依赖项**，因为 React 使用 `Object.is()` 来判断依赖项是否发生变化。

### 5. 如何清理副作用

`useEffect` 可以返回一个函数，用于清除副作用的回调。语法格式如下：

```tsx
useEffect(() => {
  // 1. 执行副作用操作
  // 2. 返回一个清理副作用的函数
  return () => { /* 在这里执行自己的清理操作 */ }
}, [依赖项]) 
```

> [!IMPORTANT]
>
> 实际应用场景：如果当前组件中使用了**定时器**或绑定了**事件监听程序**，可以在返回的函数中清除定时器或解绑监听程序。

### 6. 组件卸载时终止未完成的 Ajax 请求

在父组件 `TestRandomColor` 中，使用布尔值 `flag` 控制子组件 `RandomColor` 的展示与隐藏：

```tsx
export const TestRandomColor: React.FC = () => {
  const [flag, setFlag] = useState(true)

  return (
    <>
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
      <hr />
      {flag && <RandomColor />}
    </>
  )
}
```

在子组件 `RandomColor` 中，通过 `useEffect(fn, [])` 声明一个副作用函数，该副作用函数仅在组件首次渲染完毕后执行。在该副作用函数中，基于 fetch API 请求数据，并且在清理函数中使用 `AbortController` 对象自动终止未完成的 `Ajax` 请求。示例代码如下：

```tsx
const RandomColor: React.FC = () => {
  const [color, setColor] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://api.liulongbin.top/v1/color', { signal: controller.signal })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
        setColor(res.data.color)
      })
      .catch((err) => console.log('消息：' + err.message))

    // return 清理函数
    // 清理函数触发的时机有两个：
    // 1. 组件被卸载的时候，会调用
    // 2. 当 effect 副作用函数被再次执行之前，会先执行清理函数
    return () => controller.abort()
  }, [])

  return (
    <>
      <p>color 的颜色值是：{color}</p>
    </>
  )
} 
```

### 7. 获取鼠标在网页中移动时的位置

示例代码如下，先声明一个 `MouseInfo` 的子组件，用来监听鼠标的移动并打印鼠标的位置：

```tsx
const MouseInfo: React.FC = () => {
  // 记录鼠标的位置
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // 副作用函数
  useEffect(() => {
    // 1. 要绑定或解绑的 mousemove 事件处理函数
    const mouseMoveHandler = (e: MouseEvent) => {
      console.log({ x: e.clientX, y: e.clientY })
      setPosition({ x: e.clientX, y: e.clientY })
    }

    // 2. 组件首次渲染完毕后，为 window 对象绑定 mousemove 事件
    window.addEventListener('mousemove', mouseMoveHandler)

    // 3. 返回一个清理的函数，在每次组件卸载时，为 window 对象解绑 mousemove 事件
    return () => window.removeEventListener('mousemove', mouseMoveHandler)
  }, [])

  return (
    <>
      <p>鼠标的位置：{JSON.stringify(position)}</p>
    </>
  )
}
```

再声明一个 `TestMouseInfo` 的父组件，通过布尔值 `flag` 控制子组件 `MouseInfo` 的显示或隐藏：

```tsx
export const TestMouseInfo: React.FC = () => {
  // 定义布尔值 flag，控制子组件的显示或隐藏
  const [flag, setFlag] = useState(true)

  return (
    <>
      <h3>父组件</h3>
      {/* 点击按钮，切换 flag 的值 */}
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
      <hr />
      {flag && <MouseInfo />}
    </>
  )
} 
```

### 8. 自定义封装鼠标位置的 hook

在 `src` 目录下新建 `hooks/index.ts` 模块，并把刚才获取鼠标位置的代码封装成名为 `useMousePosition` 的自定义 `hook`，代码如下：

```tsx
import { useState, useEffect } from 'react'

export const useMousePosition = () => {
  // 记录鼠标的位置
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // 副作用函数
  useEffect(() => {
    // 1. 要绑定或解绑的 mousemove 事件处理函数
    const mouseMoveHandler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    // 2. 组件首次渲染完毕后，为 window 对象绑定 mousemove 事件
    window.addEventListener('mousemove', mouseMoveHandler)

    // 3. 返回一个清理的函数，在每次组件卸载时，为 window 对象解绑 mousemove 事件
    return () => window.removeEventListener('mousemove', mouseMoveHandler)
  }, [])

  return position
}
```

在 `MouseInfo` 组件中，可以导入自己封装的 `hook` 进行使用：

```tsx
import { useMousePosition } from '@/hooks/index.ts'

const MouseInfo: React.FC = () => {
  // 调用自定义的 hook，获取鼠标的位置信息
  const position = useMousePosition()

  return (
    <>
      <!-- 输出鼠标的位置信息 -->
      <p>鼠标的位置：{JSON.stringify(position)}</p>
    </>
  )
} 
```

在 `TestMouseInfo` 组件中，也可以导入自己封装的 `hook` 进行使用：

```tsx
import { useMousePosition } from '@/hooks/index.ts'

export const TestMouseInfo: React.FC = () => {
  const [flag, setFlag] = useState(true)
  // 调用自定义的 hook，获取鼠标的位置信息
  const position = useMousePosition()

  return (
    <>
      <!-- 输出鼠标的位置信息 -->
      <h3>父组件 {position.x + position.y}</h3>
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
      <hr />
      {flag && <MouseInfo />}
    </>
  )
}
```

### 9. 自定义封装秒数倒计时的 hook

功能分析：

1. 用户调用 `useCountDown(5)` 的 hook，可以传递倒计时的秒数，如果未指定秒数则默认值为 `10` 秒
2. 在 `useCountDown` 中，需要对用户传递进行来的数字进行非法值的判断和处理（处理负数、小数、0）
3. 每隔1秒让秒数 `-1`，并使用一个布尔值记录按钮是否被禁用
4. 以数组的形式，向外返回每次的秒数和当前的禁用状态，例如 `return [count, disabled]`

最终，用户可以按照如下的方式，使用我们封装的 `useCountDown hook`：

```tsx
import React from 'react'
// 1. 导入自定义的 hook
import { useCountDown } from '@/hooks/index.ts'

export const CountDown: React.FC = () => {
  // 2. 调用自定义的 hook
  const [count, disabled] = useCountDown(3)

  return (
    <>
      <!-- 3. 展示倒计时的秒数，并控制按钮的禁用状态 -->
      <button disabled={disabled} onClick={() => console.log('协议生效！')}>
        {disabled ? `请仔细阅读本协议内容（${count} 秒）` : '确认此协议'}
      </button>
    </>
  )
} 
```

接下来，我们可以在 `src/hooks/index.ts` 模块中，封装名为 `useCountDown` 的自定义 `hook`。具体代码如下：

```tsx
import { useState, useEffect } from 'react'

// TS 类型
type UseCountDown = (seconds: number) => [number, boolean]

export const useCountDown: UseCountDown = (seconds = 10) => {
  // 对外界传递的数值进行非法值处理：
  // 1. 先求绝对值
  // 2. 再对小数进行四舍五入
  // 3. 如果处理的结果为数字 0，则将默认值设为 10
  seconds = Math.round(Math.abs(seconds)) || 10

  // 计数器
  const [count, setCount] = useState(seconds)
  // 倒计时是否结束 disabled 为 false 表示结束，为 true 表示未结束
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (count > 1) {
        setCount((prev) => prev - 1)
      } else {
        setDisabled(false)
      }
    }, 1000)

    // 返回清理函数，再次执行 useEffect 的副作用函数之前，先运行上次 return 的清理函数
    return () => clearTimeout(timerId)
  }, [count])

  // 返回 count 和 disabled 供组件使用
  // 1. count 用来显示倒计时的秒数
  // 2. disabled 用来控制按钮是否禁用 Or 倒计时是否结束
  return [count, disabled]
} 
```

### 10. useEffect 的使用注意事项

> [!TIP]
>
> 1. 不要在 `useEffect` 中改变依赖项的值，会造成死循环。
> 2. 多个不同功能的副作用尽量分开声明，不要写到一个 `useEffect` 中。

## 7. useLayoutEffect 和 useEffect 的对比

### 1. 用法相似

`useLayoutEffect` 和 `useEffect` 的使用方式很相似：

> [!TIP]
>
> 1. `useLayout` 接收一个函数和一个依赖项数组作为参数
> 2. 只有在数组中的依赖项发生改变时才会再次执行副作用函数
> 3. `useLayoutEffect` 也可以返回一个清理函数

### 2. 两者的区别

**执行时机不同：**

    `useEffect` 中的回调函数在浏览器重新绘制屏幕之后触发
    
    `useLayoutEffect` 中的回调函数在浏览器重新绘制屏幕之前触发

**执行过程不同：**

    `useEffect` 中的回调函数异步执行，不阻塞浏览器绘制
    
    `useLayoutEffect` 中的回调函数同步执行，阻塞浏览器重新绘制

> [!IMPORTANT]
>
> 注意：React 保证了 `useLayoutEffect` 中的代码以及其中任何计划的状态更新都会在浏览器重新绘制屏幕之前得到处理。

### 3. useLayoutEffect 的使用示例

点击按钮，把 num 值设置为 0，当页面更新完成后，判断 num 是否等于 0，如果等于 0，则在 `useEffect `中把 num 赋值为随机的数字：

```tsx
export const RandomNumber: React.FC = () => {
  const [num, setNum] = useState(Math.random() * 200)

  useEffect(() => {
    if (num === 0) {
      setNum(10 + Math.random() * 200)
    }
  }, [num])

  return (
    <>
      <h1>num 的值是：{num}</h1>
      <button onClick={() => setNum(0)}>重置 num</button>
    </>
  )
} 
```

运行上面的代码，我们会发现这串数字会出现闪烁的情况。原因是页面会先将 h1 渲染为 0，然后再渲染成随机的数字，由于更新的很快便出现了闪烁。

为了解决上述问题，可以把 `useEffect` 替换为 `useLayoutEffect`：

```tsx
export const RandomNumber: React.FC = () => {
  const [num, setNum] = useState(Math.random() * 200)

  useLayoutEffect(() => {
    if (num === 0) {
      setNum(10 + Math.random() * 200)
    }
  }, [num])

  return (
    <>
      <h1>num 的值是：{num}</h1>
      <button onClick={() => setNum(0)}>重置 num</button>
    </>
  )
} 
```

更改完成后再次运行代码，发现数字不再闪烁了。因为点击按钮时，num 更新为 0，但此时页面不会渲染，而是等待 `useLayoutEffect` 内部状态修改后才会更新页面，所以不会出现闪烁。

## 8. useReducer

当状态更新逻辑较复杂时可以考虑使用 useReducer。useReducer 可以同时更新多个状态，而且能把对状态的修改从组件中独立出来。

相比于 useState，useReducer 可以更好的描述“如何更新状态”。例如：组件负责发出行为，useReducer 负责更新状态。

好处是：**让代码逻辑更清晰，代码行为更易预测。**

### 1. useReducer 的语法格式

useReducer 的基础语法如下：

```tsx
const [state, dispatch] = useReducer(reducer, initState, initAction?)
```

其中：

1. **reducer** 是一个函数，类似于 `(prevState, action) => newState`。形参 `prevState` 表示旧状态，形参 `action` 表示本次的行为，返回值 `newState` 表示处理完毕后的新状态。
2. **initState** 表示初始状态，也就是默认值。
3. **initAction** 是进行状态初始化时候的处理函数，它是可选的，如果提供了 initAction 函数，则会把 initState 传递给 initAction 函数进行处理，initAction 的返回值会被当做初始状态。
4. 返回值 state 是状态值。dispatch 是更新 state 的方法，让他接收 action 作为参数，useReducer 只需要调用 `dispatch(action)` 方法传入的 action 即可更新 state。

### 2. 定义组件的基础结构

定义名为 `Father` 的父组件如下：

```tsx
import React from 'react'

// 父组件
export const Father: React.FC = () => {
  return (
    <div>
      <button>修改 name 的值</button>
      <div className="father">
        <Son1 />
        <Son2 />
      </div>
    </div>
  )
}
```

定义名为 `Son1` 和 `Son2` 的两个子组件如下：

```tsx
// 子组件1
const Son1: React.FC = () => {
  return <div className="son1"></div>
}

// 子组件2
const Son2: React.FC = () => {
  return <div className="son2"></div>
} 
```

在 `index.css` 中添加对应的样式：

```css
.father {
  display: flex;
  justify-content: space-between;
  width: 100vw;
}

.son1 {
  background-color: orange;
  min-height: 300px;
  flex: 1;
  padding: 10px;
}

.son2 {
  background-color: lightblue;
  min-height: 300px;
  flex: 1;
  padding: 10px;
} 
```

### 3. 定义 useReducer 的基础结构

按需导入 `useReducer` 函数：

```tsx
import React, { useReducer } from 'react'
```

定义**初始数据**：

```tsx
const defaultState = { name: 'liulongbin', age: 16 }
```

定义 `reducer` 函数，它的作用是：**根据旧状态，进行一系列处理，最终返回新状态：**

```tsx
const reducer = (prevState) => {
  console.log('触发了 reducer 函数')
  return prevState
} 
```

在 `Father` 组件中，调用 `useReducer(reducerFn, 初始状态)` 函数，并得到 reducer 返回的状态：

```tsx
// 父组件
export const Father: React.FC = () => {
  // useReducer(fn, 初始数据, 对初始数据进行处理的fn)
  const [state] = useReducer(reducer, defaultState)
  console.log(state)

  return (
    <div>
      <button>修改 name 的值</button>
      <div className="father">
        <Son1 />
        <Son2 />
      </div>
    </div>
  )
}
```

为 reducer 中的 initState 指定数据类型：

```tsx
// 定义状态的数据类型
type UserType = typeof defaultState

const defaultState = { name: 'liulongbin', age: 16 }

// 给 initState 指定类型为 UserType
const reducer = (prevState: UserType) => {
  console.log('触发了 reducer 函数')
  return prevState
} 
```

接下来，在 `Father` 组件中使用 state 时，就可以出现类型的智能提示啦：

```tsx
// 父组件
export const Father: React.FC = () => {
  const [state] = useReducer(reducer, defaultState)
  console.log(state.name, state.age)

  return (
    <div>
      <button>修改 name 的值</button>
      <div className="father">
        <Son1 />
        <Son2 />
      </div>
    </div>
  )
} 
```

### 4. 使用 initAction 处理初始数据

定义名为 `initAction` 的处理函数，如果初始数据中的 age 为小数、负数、或 0 时，对 age 进行非法值的处理：

```tsx
const initAction = (initState: UserType) => {
  // 把 return 的对象，作为 useReducer 的初始值
  return { ...initState, age: Math.round(Math.abs(initState.age)) || 18 }
}
```

在 `Father` 组件中，使用步骤1声明的 `initAction` 函数如下：

```tsx
// 父组件
export const Father: React.FC = () => {
  // useReducer(fn, 初始数据, 对初始数据进行处理的fn)
  const [state] = useReducer(reducer, defaultState, initAction)

  // 省略其它代码...
}
```

> [!TIP]
>
> 可以在定义 defaultState 时，为 age 提供非法值，可以看到非法值在 initAction 中被处理掉了。

### 5. 在 Father 组件中点击按钮修改 name 的值

1. **错误示范：**

```tsx
// 父组件
export const Father: React.FC = () => {
  // useReducer(fn, 初始数据, 对初始数据进行处理的fn)
  const [state] = useReducer(reducer, defaultState, initAction)
  console.log(state)

  const onChangeName = () => {
    // 注意：这种用法是错误的，因为不能直接修改 state 的值
    // 因为存储在 useReducer 中的数据都是“不可变”的！
    // 要想修改 useReducer 中的数据，必须触发 reducer 函数的重新计算，
    // 根据 reducer 形参中的旧状态对象（initState），经过一系列处理，返回一个“全新的”状态对象
    state.name = 'escook'
  }

  return (
    <div>
      <button onClick={onChangeName}>修改 name 的值</button>
      <div className="father">
        <Son1 />
        <Son2 />
      </div>
    </div>
  )
} 
```

2. **正确的操作**

为了能够触发 reducer 函数的重新执行，我们需要在调用 `useReducer()` 后接收返回的 `dispatch` 函数。示例代码如下：

```tsx
// Father 父组件
const [state, dispatch] = useReducer(reducer, defaultState, initAction) 
```

在 button 按钮的点击事件处理函数中，调用 `dispatch()` 函数，从而触发 reducer 函数的重新计算：

```tsx
// Father 父组件
const onChangeName = () => {
  dispatch()
}
```

点击 `Father` 组件中如下的 `button` 按钮：

```tsx
<button onClick={onChangeName}>修改 name 的值</button> 
```

会触发 reducer 函数的重新执行，并打印 reducer 中的 `console.log()`，代码如下：

```tsx
const reducer = (prevState: UserType) => {
  console.log('触发了 reducer 函数')
  return prevState
} 
```

3. **调用 dispatch 传递参数给 reducer**

在 Father 父组件按钮的点击事件处理函数 `onChangeName` 中，调用 **dispatch()** 函数并把参数传递给 **reducer** 的第2个形参，代码如下：

```tsx
const onChangeName = () => {
  // 注意：参数的格式为 { type, payload? }
  // 其中：
  // type 的值是一个唯一的标识符，用来指定本次操作的类型，一般为大写的字符串
  // payload 是本次操作需要用到的数据，为可选参数。在这里，payload 指的是把用户名改为字符串 '刘龙彬'
  dispatch({type: 'UPDATE_NAME', payload: '刘龙彬'})
} 
```

修改 reducer 函数的形参，添加名为 `action` 的第2个形参，用来接收 `dispatch` 传递过来的数据：

```tsx
const reducer = (prevState: UserType, action) => {
  // 打印 action 的值，终端显示的值为：
  // {type: 'UPDATE_NAME', payload: '刘龙彬'}
  console.log('触发了 reducer 函数', action)
  return prevState
} 
```

在 reducer 中，根据接收到的 `action.type` 标识符，**决定进行怎样的更新操作**，最终 return 一个计算好的新状态。示例代码如下：

```tsx
const reducer = (prevState: UserType, action) => {
  console.log('触发了 reducer 函数', action)
  // return prevState

  switch (action.type) {
    // 如果标识符是字符串 'UPDATE_NAME'，则把用户名更新成 action.payload 的值
    // 最后，一定要返回一个新状态，因为 useReducer 中每一次的状态都是“不可变的”
    case 'UPDATE_NAME':
      return { ...prevState, name: action.payload }
    // 兜底操作：
    // 如果没有匹配到任何操作，则默认返回上一次的旧状态
    default:
      return prevState
  }
}
```

在上述的 `switch...case...` 代码期间，没有任何 TS 的类型提示，这在大型项目中是致命的。因此，我们需要为 reducer 函数的第2个形参 **action** 指定操作的类型：

```tsx
// 1. 定义 action 的类型
type ActionType = { type: 'UPDATE_NAME'; payload: string }

// 2. 为 action 指定类型为 ActionType
const reducer = (prevState: UserType, action: ActionType) => {
  console.log('触发了 reducer 函数', action)

  // 3. 删掉之前的代码，再重复编写这段逻辑的时候，会出现 TS 的类型提示，非常 Nice
  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...prevState, name: action.payload }
    default:
      return prevState
  }
}
```

同时，在 Father 组件的 `onChangeName` 处理函数内，调用 `dispatch()` 时也有了类型提示：

```tsx
const onChangeName = () => {
  dispatch({ type: 'UPDATE_NAME', payload: '刘龙彬' })
} 
```

> [!IMPORTANT]
>
> 注意：在今后的开发中，正确的顺序是先定义 ActionType 的类型，再修改 reducer 中的 switch...case... 逻辑，最后在组件中调用 dispatch() 函数哦！这样能够充分利用 TS 的类型提示。

### 6. 把用户信息渲染到子组件中

在 Father 父组件中，通过展开运算符把 state 数据对象绑定为 `Son1` 和 ` Son2` 的 `props` 属性：

```tsx
// 父组件
export const Father: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, defaultState, initAction)

  const onChangeName = () => {
    dispatch({ type: 'UPDATE_NAME', payload: '刘龙彬' })
  }

  return (
    <div>
      <button onClick={onChangeName}>修改 name 的值</button>
      <div className="father">
        <!-- 通过 props 的数据绑定，把数据传递给子组件 -->
        <Son1 {...state} />
        <Son2 {...state} />
      </div>
    </div>
  )
}
```

在子组件中，指定 props 的类型为 `React.FC<UserType>`，并使用 props 接收和渲染数据：

```tsx
// 子组件1
const Son1: React.FC<UserType> = (props) => {
  return (
    <div className="son1">
      <p>用户信息：</p>
      <p>{JSON.stringify(props)}</p>
    </div>
  )
}

// 子组件2
const Son2: React.FC<UserType> = (props) => {
  return (
    <div className="son2">
      <p>用户信息：</p>
      <p>{JSON.stringify(props)}</p>
    </div>
  )
}
```

> [!TIP]
>
> 修改完成后，点击父组件中的 button 按钮修改用户名，我们发现两个子组件中的数据同步发生了变化。

### 7. 在子组件中实现点击按钮 age 自增操作

扩充 `ActionType` 的类型如下：

```tsx
// 定义 action 的类型
type ActionType = { type: 'UPDATE_NAME'; payload: string } | { type: 'INCREMENT'; payload: number } 
```

在 `reducer` 中添加 `INCREMENT` 的 `case` 匹配：

```tsx
const reducer = (prevState: UserType, action: ActionType) => {
  console.log('触发了 reducer 函数', action)

  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...prevState, name: action.payload }
    // 添加 INCREMENT 的 case 匹配
    case 'INCREMENT':
      return { ...prevState, age: prevState.age + action.payload }
    default:
      return prevState
  }
}
```

在子组件 `Son1` 中添加 `+1` 的 button 按钮，并绑定点击事件处理函数：

```tsx
// 子组件1
const Son1: React.FC<UserType> = (props) => {
  const add = () => {}

  return (
    <div className="son1">
      <p>用户信息：</p>
      <p>{JSON.stringify(props)}</p>
      <button onClick={add}>+1</button>
    </div>
  )
}
```

现在的问题是：子组件 Son1 中无法调用到父组件的 `dispatch` 函数。为了解决这个问题，我们需要在 Father 父组件中，通过 props 把父组件中的 `dispatch` 传递给子组件：

```tsx
// 父组件
export const Father: React.FC = () => {
  // useReducer(fn, 初始数据, 对初始数据进行处理的fn)
  const [state, dispatch] = useReducer(reducer, defaultState, initAction)

  const onChangeName = () => {
    dispatch({ type: 'UPDATE_NAME', payload: '刘龙彬' })
  }

  return (
    <div>
      <button onClick={onChangeName}>修改 name 的值</button>
      <div className="father">
        <Son1 {...state} dispatch={dispatch} />
        <Son2 {...state} />
      </div>
    </div>
  )
} 
```

在 `Son1` 子组件中，扩充 `React.FC<UserType>` 的类型，并从 `props` 中把 **dispatch** 和**用户信息对象**分离出来：

```tsx
// 子组件1
const Son1: React.FC<UserType & { dispatch: React.Dispatch<ActionType> }> = (props) => {
  const { dispatch, ...user } = props

  const add = () => dispatch({ type: 'INCREMENT', payload: 1 })

  return (
    <div className="son1">
      <p>用户信息：</p>
      <p>{JSON.stringify(user)}</p>
      <button onClick={add}>+1</button>
    </div>
  )
}
```

### 8. 在子组件中实现点击按钮 age 自减操作

扩充 `ActionType` 的类型如下：

```tsx
// 定义 action 的类型
type ActionType = { type: 'UPDATE_NAME'; payload: string } | { type: 'INCREMENT'; payload: number } | { type: 'DECREMENT'; payload: number } 
```

在 `reducer` 中添加 `DECREMENT` 的 `case` 匹配：

```tsx
const reducer = (prevState: UserType, action: ActionType) => {
  console.log('触发了 reducer 函数', action)

  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...prevState, name: action.payload }
    case 'INCREMENT':
      return { ...prevState, age: prevState.age + action.payload }
    // 添加 DECREMENT 的 case 匹配
    case 'DECREMENT':
      return { ...prevState, age: prevState.age - action.payload }
    default:
      return prevState
  }
}
```

在子组件 `Son2` 中添加 `-5` 的 button 按钮，并绑定点击事件处理函数：

```tsx
// 子组件2
const Son2: React.FC<UserType> = (props) => {
  const sub = () => { }

  return (
    <div className="son2">
      <p>用户信息：</p>
      <p>{JSON.stringify(props)}</p>
      <button onClick={sub}>-5</button>
    </div>
  )
}
```

现在的问题是：子组件 Son2 中无法调用到父组件的 `dispatch` 函数。为了解决这个问题，我们需要在 Father 父组件中，通过 props 把父组件中的 `dispatch` 传递给子组件：

```tsx
// 父组件
export const Father: React.FC = () => {
  // useReducer(fn, 初始数据, 对初始数据进行处理的fn)
  const [state, dispatch] = useReducer(reducer, defaultState, initAction)

  const onChangeName = () => {
    dispatch({ type: 'UPDATE_NAME', payload: '刘龙彬' })
  }

  return (
    <div>
      <button onClick={onChangeName}>修改 name 的值</button>
      <div className="father">
        <Son1 {...state} dispatch={dispatch} />
        <Son2 {...state} dispatch={dispatch} />
      </div>
    </div>
  )
} 
```

在 `Son2`子组件中，扩充 `React.FC<UserType>` 的类型，并从 `props` 中把 **dispatch** 和**用户信息对象**分离出来：

```tsx
// 子组件2
const Son2: React.FC<UserType & { dispatch: React.Dispatch<ActionType> }> = (props) => {
  const { dispatch, ...user } = props
  const sub = () => dispatch({ type: 'DECREMENT', payload: 5 })

  return (
    <div className="son2">
      <p>用户信息：</p>
      <p>{JSON.stringify(user)}</p>
      <button onClick={sub}>-5</button>
    </div>
  )
}
```

### 9. 在 GrandSon 组件中实现重置按钮

扩充 `ActionType` 的类型如下：

```tsx
// 定义 action 的类型
type ActionType = { type: 'UPDATE_NAME'; payload: string } | { type: 'INCREMENT'; payload: number } | { type: 'DECREMENT'; payload: number } | { type: 'RESET' } 
```

在 `reducer` 中添加 `RESET` 的 `case` 匹配：

```tsx
const reducer = (prevState: UserType, action: ActionType) => {
  console.log('触发了 reducer 函数', action)

  switch (action.type) {
    case 'UPDATE_NAME':
      return { ...prevState, name: action.payload }
    case 'INCREMENT':
      return { ...prevState, age: prevState.age + action.payload }
    case 'DECREMENT':
      return { ...prevState, age: prevState.age - action.payload }
    // 添加 RESET 的 case 匹配
    case 'RESET':
      return defaultState
    default:
      return prevState
  }
} 
```

在 `GrandSon` 组件中，添加重置按钮，并绑定点击事件处理函数：

```tsx
const GrandSon: React.FC<{ dispatch: React.Dispatch<ActionType> }> = (props) => {
  const reset = () => props.dispatch({ type: 'RESET' })

  return (
    <>
      <h3>这是 GrandSon 组件</h3>
      <button onClick={reset}>重置</button>
    </>
  )
} 
```

### 10. 使用 Immer 编写更简洁的 reducer 更新逻辑

安装 `immer` 相关的依赖包：

> `npm install immer use-immer -S `

从 `use-immer` 中导入 `useImmerReducer` 函数，并替换掉 React 官方的 `useReducer` 函数的调用：

```tsx
// 1. 导入 useImmerReducer
import { useImmerReducer } from 'use-immer'

// 父组件
export const Father: React.FC = () => {
  // 2. 把 useReducer() 的调用替换成 useImmerReducer()
  const [state, dispatch] = useImmerReducer(reducer, defaultState, initAction)
}
```

修改 reducer 函数中的业务逻辑，`case` 代码块中不再需要 return 不可变的新对象了，只需要在 prevState 上进行修改即可。**Immer 内部会复制并返回新对象**，因此降低了用户的心智负担。改造后的 reducer 代码如下：

```tsx
const reducer = (prevState: UserType, action: ActionType) => {
  console.log('触发了 reducer 函数', action)

  switch (action.type) {
    case 'UPDATE_NAME':
      // return { ...prevState, name: action.payload }
      prevState.name = action.payload
      break
    case 'INCREMENT':
      // return { ...prevState, age: prevState.age + action.payload }
      prevState.age += action.payload
      break
    case 'DECREMENT':
      // return { ...prevState, age: prevState.age - action.payload }
      prevState.age -= action.payload
      break
    case 'RESET':
      return defaultState
    default:
      return prevState
  }
} 
```

## 9. useContext

在 `react` 函数式组件中，如果组件的嵌套层级很深，当父组件想把数据共享给最深层的子组件时，传统的办法是使用 `props`，一层一层把数据向下传递。

使用 `props` 层层传递数据的维护性太差了，我们可以使用 `React.createContext() + useContext()` 轻松实现多层组件的数据传递。

![Context的基础概念](/react_images/01.png)

### 1. useContext 的语法格式

主要的使用步骤如下：

1. 在全局创建 `Context` 对象
2. 在父组件中使用 `Context.Provider` 提供数据
3. 在子组件中使用 `useContext` 使用数据

```tsx
import React, { useContext } from 'react'

// 全局
const MyContext = React.createContext(初始数据)

// 父组件
const Father = () => {
  return <MyContext.Provider value={{name: 'escook', age: 22}}>
    <!-- 省略其它代码 -->
  </MyContext.Provider>
}

// 子组件
const Son = () => {
  const myCtx = useContext(MyContext)
  return <div>
    <p>姓名：{myCtx.name}</p>
    <p>年龄：{MyCtx.age}</p>
  </div>
} 
```

### 2. 定义组件结构

定义 `LevelA，LevelB，LevelC` 的组件结构如下：

```tsx
import React, { useState } from 'react'

export const LevelA: React.FC = () => {
  // 定义状态
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: 30, backgroundColor: 'lightblue', width: '50vw' }}>
      <p>count值是：{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      {/* 使用子组件 */}
      <LevelB />
    </div>
  )
}

export const LevelB: React.FC = () => {
  return (
    <div style={{ padding: 30, backgroundColor: 'lightgreen' }}>
      {/* 使用子组件 */}
      <LevelC />
    </div>
  )
}

export const LevelC: React.FC = () => {
  return (
    <div style={{ padding: 30, backgroundColor: 'lightsalmon' }}>
      <button>+1</button>
      <button>重置</button>
    </div>
  )
} 
```

### 3. createContext 配合 useContext 使用

在父组件中，调用 `React.createContext` 向下共享数据；在子组件中调用 `useContext()` 获取数据。示例代码如下：

```tsx
import React, { useState, useContext } from 'react'

// 声明 TS 类型
type ContextType = { count: number; setCount: React.Dispatch<React.SetStateAction<number>> }

// 1. 创建 Context 对象
const AppContext = React.createContext<ContextType>({} as ContextType)

export const LevelA: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: 30, backgroundColor: 'lightblue', width: '50vw' }}>
      <p>count值是：{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      {/* 2. 使用 Context.Provider 向下传递数据 */}
      <AppContext.Provider value={{ count, setCount }}>
        <LevelB />
      </AppContext.Provider>
    </div>
  )
}

export const LevelB: React.FC = () => {
  return (
    <div style={{ padding: 30, backgroundColor: 'lightgreen' }}>
      <LevelC />
    </div>
  )
}

export const LevelC: React.FC = () => {
  // 3. 使用 useContext 接收数据
  const ctx = useContext(AppContext)

  return (
    <div style={{ padding: 30, backgroundColor: 'lightsalmon' }}>
      {/* 4. 使用 ctx 中的数据和方法 */}
      <p>count值是：{ctx.count}</p>
      <button onClick={() => ctx.setCount((prev) => prev + 1)}>+1</button>
      <button onClick={() => ctx.setCount(0)}>重置</button>
    </div>
  )
} 
```

### 4. ☆☆☆以非侵入的方式使用 Context

在刚才的案例中，我们发现父组件 `LevelA` 为了向下传递共享的数据，在代码中侵入了 `<AppContext.Provider>` 这样的代码结构。

为了保证父组件中代码的单一性，也为了提高 `Provider` 的通用性，我们可以考虑把 `Context.Provider` 封装到独立的 `Wrapper` 函数式组件中，例如：

```tsx
// 声明 TS 类型
type ContextType = { count: number; setCount: React.Dispatch<React.SetStateAction<number>> }
// 创建 Context 对象
const AppContext = React.createContext<ContextType>({} as ContextType)

// 定义独立的 Wrapper 组件，被 Wrapper 嵌套的子组件会被 Provider 注入数据
export const AppContextWrapper: React.FC<React.PropsWithChildren> = (props) => {
  // 1. 定义要共享的数据
  const [count, setCount] = useState(0)
  // 2. 使用 AppContext.Provider 向下共享数据
  return <AppContext.Provider value={{ count, setCount }}>{props.children}</AppContext.Provider>
} 
```

定义好 `Wrapper` 组件后，我们可以在 `App.tsx` 中导入并使用 `Wrapper` 和 `LevelA `组件，代码如下：

```tsx
import React from 'react'
import { AppContextWrapper, LevelA } from '@/components/use_context/01.base.tsx'

const App: React.FC = () => {
  return (
    <AppContextWrapper>
      <!-- AppContextWrapper 中嵌套使用了 LevelA 组件，形成了父子关系 -->
      <!-- LevelA 组件会被当做 children 渲染到 Wrapper 预留的插槽中 -->
      <LevelA />
    </AppContextWrapper>
  )
}

export default App
```

这样，组件树的嵌套关系为：`App => Wrapper => LevelA => LevelB => LevelC`。因此在 `LevelA、LevelB` 和 `LevelC` 组件中，都可以使用 `context` 中的数据。例如，`LevelA `组件中的代码如下：

```tsx
export const LevelA: React.FC = () => {
  // 使用 useContext 接收数据
  const ctx = useContext(AppContext)

  return (
    <div style={{ padding: 30, backgroundColor: 'lightblue', width: '50vw' }}>
      {/* 使用 ctx 中的数据和方法 */}
      <p>count值是：{ctx.count}</p>
      <button onClick={() => ctx.setCount((prev) => prev + 1)}>+1</button>
      <LevelB />
    </div>
  )
} 
```

`LevelC` 组件中的代码如下：

```tsx
export const LevelC: React.FC = () => {
  // 使用 useContext 接收数据
  const ctx = useContext(AppContext)

  return (
    <div style={{ padding: 30, backgroundColor: 'lightsalmon' }}>
      {/* 使用 ctx 中的数据和方法 */}
      <p>count值是：{ctx.count}</p>
      <button onClick={() => ctx.setCount((prev) => prev + 1)}>+1</button>
      <button onClick={() => ctx.setCount(0)}>重置</button>
    </div>
  )
}
```

> [!TIP]
>
> 核心思路：每个 `Context` 都创建一个对应的 `Wrapper` 组件，在 `Wrapper` 组件中使用 `Provider` 向 `children` 注入数据。

### 5. 使用 useContext 重构 useReducer 案例

定义 Context 要向下共享的数据的 TS 类型，代码如下：

```tsx
// 1. 定义 Context 的 TS 类型
// 在这一步，我们必须先明确要向子组件注入的数据都有哪些
type UserInfoContextType = { user: UserType; dispatch: React.Dispatch<ActionType> } 
```

使用 `React.createContext` 创建 `Context` 对象：

```tsx
// 2. 创建 Context 对象
const UserInfoContext = React.createContext<UserInfoContextType>({} as UserInfoContextType) 
```

创建 `ContextWrapper` 组件如下，把 `Father` 组件中的 `useImmerReducer` 调用过程，抽离到 `ContextWrapper` 中：

```tsx
// 3. 创建 ContextWrapper 组件
export const UserInfoContextWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useImmerReducer(reducer, defaultState, initAction)
  return <UserInfoContext.Provider value={{ user: state, dispatch }}>{children}</UserInfoContext.Provider>
} 
```

改造 `Father` 组件，调用 `useContext` 获取并使用 `Context` 中的数据。同时，`Father` 组件也不必再使用 `props` 把 `state` 和 `dispatch` 函数传递给 `Son` 子组件：

```tsx
export const Father: React.FC = () => {
  // 4. 调用 useContext 导入需要的数据
  const { user: state, dispatch } = useContext(UserInfoContext)

  const changeUserName = () => dispatch({ type: 'UPDATE_NAME', payload: '刘龙彬' })

  return (
    <div>
      <button onClick={changeUserName}>修改用户名</button>
      <p>{JSON.stringify(state)}</p>
      <div className="father">
        {/* 5. 这里没有必要再往子组件传递 props 了 */}
        {/* <Son1 {...state} dispatch={dispatch} />
        <Son2 {...state} dispatch={dispatch} /> */}
        <Son1 />
        <Son2 />
      </div>
    </div>
  )
} 
```

改造 `App` 根组件，分别导入 `UserInfoContextWrapper` 和 `Father` 组件，并形成父子关系的嵌套，这样 `Father` 组件及其子组件才可以访问到 `Context` 中的数据：

```tsx
import React from 'react'
import { UserInfoContextWrapper, Father } from '@/components/use_reducer/01.base.tsx'

const App: React.FC = () => {
  return (
    <UserInfoContextWrapper>
      <Father />
    </UserInfoContextWrapper>
  )
}

export default App 
```

最后，改造 `Son1，Son2` 和 `GrandSon` 组件，删除 `props` 及其类型定义，改用 `useContext()` 来获取 `UserInfoContextWrapper` 向下注入的数据。示例代码如下：

```tsx
const Son1: React.FC = () => {
  // 6. 把 props 替换为 useContext() 的调用
  const { dispatch, user } = useContext(UserInfoContext)

  const add = () => dispatch({ type: 'INCREMENT', payload: 1 })

  return (
    <div className="son1">
      <p>{JSON.stringify(user)}</p>
      <button onClick={add}>年龄+1</button>
    </div>
  )
}

const Son2: React.FC = () => {
  // 7. 把 props 替换为 useContext() 的调用
  const { dispatch, user } = useContext(UserInfoContext)

  const sub = () => dispatch({ type: 'DECREMENT', payload: 5 })

  return (
    <div className="son2">
      <p>{JSON.stringify(user)}</p>
      <button onClick={sub}>年龄-5</button>
      <hr />
      <GrandSon />
    </div>
  )
}

const GrandSon: React.FC = () => {
  // 8. 把 props 替换为 useContext() 的调用
  const { dispatch } = useContext(UserInfoContext)
  const reset = () => dispatch({ type: 'RESET' })

  return (
    <>
      <h3>这是 GrandSon 组件</h3>
      <button onClick={reset}>重置</button>
    </>
  )
}
```

## 10. useMemo 和 memo 函数

### 1. memo 函数

当父组件被重新渲染的时候，也会触发子组件的重新渲染，这样就多出了无意义的性能开销。如果子组件的状态没有发生变化，则子组件是必须要被重新渲染的。

在 `React` 中，我们可以使用 `React.memo()` 函数来解决上述的问题，从而达到提高性能的目的。

`React.memo()` 的语法格式如下：

```tsx
const 组件 = React.memo(函数式组件)
```

例如，在下面的代码中，父组件声明了 `count` 和 `flag `两个状态，子组件依赖于父组件通过 `props` 传递的 `num`。当父组件修改 `flag` 的值时，会导致子组件的重新渲染：

```tsx
import React, { useEffect, useState } from 'react'

// 父组件
export const Father: React.FC = () => {
  // 定义 count 和 flag 两个状态
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  return (
    <>
      <h1>父组件</h1>
      <p>count 的值是：{count}</p>
      <p>flag 的值是：{String(flag)}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
      <hr />
      <Son num={count} />
    </>
  )
}

// 子组件：依赖于父组件通过 props 传递进来的 num
export const Son: React.FC<{ num: number }> = ({ num }) => {
  useEffect(() => {
    console.log('触发了子组件的渲染')
  })
  return (
    <>
      <h3>子组件 {num}</h3>
    </>
  )
}
```

我们使用 `React.memo`(函数式组件) 将子组件包裹起来，只有子组件依赖的 `props `发生变化的时候，才会触发子组件的重新渲染。示例代码如下：

```tsx
// 子组件：依赖于父组件通过 props 传递进来的 num
export const Son: React.FC<{ num: number }> = React.memo(({ num }) => {
  useEffect(() => {
    console.log('触发了子组件的渲染')
  })
  return (
    <>
      <h3>子组件 --- {num}</h3>
    </>
  )
}) 
```

### 2. useMemo - 问题引入

进一步改造前面的案例：我们希望在 `Father` 组件中添加一个“计算属性”，根据 `flag` 值的真假，动态返回一段文本内容，并把计算的结果显示到页面上。示例代码如下：

```tsx
// 父组件
export const Father: React.FC = () => {
  // 定义 count 和 flag 两个状态
  const [count, setCount] = useState(0)
  const [flag, setFlag] = useState(false)

  // 根据布尔值进行计算，动态返回内容
  const tips = () => {
    console.log('触发了 tips 的重新计算')
    return flag ? <p>哪里贵了，不要睁着眼瞎说好不好</p> : <p>这些年有没有努力工作，工资涨没涨</p>
  }

  return (
    <>
      <h1>父组件</h1>
      <p>count 的值是：{count}</p>
      <p>flag 的值是：{String(flag)}</p>
      {tips()}
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
      <button onClick={() => setFlag((prev) => !prev)}>Toggle</button>
      <hr />
      <Son num={count} />
    </>
  )
}
```

代码编写完毕后，我们点击父组件中的 `+1` 按钮，发现 `count `在自增，而 `flag` 的值不会发生变化。此时也会触发 `tips` 函数的重新执行，这就造成了性能的浪费。

我们希望如果 `flag` 没有发生变化，则避免 `tips` 函数的重新计算，从而优化性能。此时需要用到 `React Hooks` 提供的 `useMemo API`。

### 3. useMemo - 语法格式

`useMemo` 的语法格式如下：

```tsx
const memorizedValue = useMemo(cb, array)

const memoValue = useMemo(() => {
  return 计算得到的值
}, [value]) // 表示监听 value 的变化 
```

其中：

1. `cb`：这是一个函数，用户处理计算的逻辑，必须使用 `return` 返回计算的结果；
2. `array`：这个数组中存储的是依赖项，只要依赖项发生变化，都会触发 `cb` 的重新执行。

> [!TIP]
>
> 使用 `array` 需要注意以下3点：
>
> 1. 不传数组，每次更新都会重新计算
> 2. 空数组，只会计算一次
> 3. 依赖对应的值，对应的值发生变化时会重新执行 `cb`

### 4. useMemo - 使用 useMemo 解决刚才的问题

导入 `useMemo`：

```tsx
import React, { useEffect, useState, useMemo } from 'react'
```

在 `Father` 组件中，使用 `useMemo` 对 `tips` 进行改造：

```tsx
// 根据布尔值进行计算，动态返回内容
const tips = useMemo(() => {
  console.log('触发了 tips 的重新计算')
  return flag ? <p>哪里贵了，不要睁着眼瞎说好不好</p> : <p>这些年有没有努力工作，工资涨没涨</p>
}, [flag]) 
```

此时，点击 `Father `中的 `+1` 按钮，并不会触发 `tips` 的重新计算，而是会使用上一次缓存的值进行渲染。只有依赖项 `flag` 变化时，才会触发 `tips` 的重新计算。

## 11. useCallback

### 1. 语法格式

之前我们所学的 `useMemo` 能够达到缓存某个变量值的效果，而当前要学习的 `useCallback` 用来对组件内的函数进行缓存，它返回的是缓存的函数。它的语法格式如下：

```tsx
const memoCallback = useCallback(cb, array) 
```

useCallback 会返回一个 memorized 回调函数供组件使用，从而防止组件每次 rerender 时反复创建相同的函数，能够节省内存开销，提高性能。其中：

1. cb 是一个函数，用于处理业务逻辑，这个 cb 就是需要被缓存的函数
2. array 是依赖项列表，当 array 中的依赖项变化时才会重新执行 useCallback。

   a. 如果省略 array，则每次更新都会重新计算

   b. 如果 array 为空数组，则只会在组件第一次初始化的时候计算一次

   c. 如果 array 不为空数组，则只有当依赖项的值变化时，才会重新计算

### 2. 基本示例

接下来，我们通过下面的例子演示使用 `useCallback` 的必要性：当输入框触发 `onChange` 事件时，会给 `kw` 重新赋值。

`kw` 值的改变会导致组件的 `rerender`，而组件的 `rerender` 会导致反复创建 `onKwChange` 函数并添加到 `Set` 集合中，造成了不必要的内存浪费。代码如下：

```tsx
import React, { useState, useCallback } from 'react'

// 用来存储函数的 set 集合
const set = new Set()

export const Search: React.FC = () => {
  const [kw, setKw] = useState('')

  const onKwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }

  // 把 onKwChange 函数的引用，存储到 set 集合中
  set.add(onKwChange)
  // 打印 set 集合中元素的数量
  console.log('set 中函数的数量为：' + set.size)

  return (
    <>
      <input type="text" value={kw} onChange={onKwChange} />
      <hr />
      <p>{kw}</p>
    </>
  )
}
```

运行上面的代码，我们发现每次文本框的值发生变化，都会打印 `set.size` 的值，而且这个值一直在自增 `+1`，因为每次组件 `rerender` 都会创建一个新的 `onKwChange` 函数添加到 `set` 集合中。

为了防止 `Search` 组件 `rerender` 时每次都会重新创建 `onKwChange` 函数，我们可以使用 `useCallback` 对这个函数进行缓存。改造后的代码如下：

```tsx
import React, { useState, useCallback } from 'react'

// 用来存储函数的 set 集合
const set = new Set()

export const Search: React.FC = () => {
  const [kw, setKw] = useState('')

  const onKwChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }, [])

  // 把 onKwChange 函数的引用，存储到 set 集合中
  set.add(onKwChange)
  // 打印 set 集合中元素的数量
  console.log('set 中函数的数量为：' + set.size)

  return (
    <>
      <input type="text" value={kw} onChange={onKwChange} />
      <hr />
      <p>{kw}</p>
    </>
  )
} 
```

运行改造后的代码，我们发现无论 `input` 的值如何发生变化，每次打印的 `set.size` 的值都是 **1**。证明我们使用 `useCallback` 实现了对函数的缓存。

### 3. useCallback 的案例

#### 3.1 问题引入

导入需要的 `hooks` 函数，并定义需要的 `TS` 类型：

```tsx
import React, { useEffect, useState, useCallback } from 'react'

// 文本框组件的 props 类型
type SearchInputType = { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
// 单词对象的 TS 类型
type WordType = { id: number; word: string } 
```

定义 `SearchInput` 搜索框子组件，接收父组件传递进来的 `onChange` 处理函数，每当 `input` 触发 `onChange` 事件时，调用 `props.onChange` 进行处理：

```tsx
// 子组件
const SearchInput: React.FC<SearchInputType> = (props) => {
  useEffect(() => {
    console.log('触发了 SearchInput 的 rerender')
  })

  return <input onChange={props.onChange} placeholder="请输入搜索关键字" />
}
```

定义 `SearchResult` 搜索结果子组件，接收父组件传递进来的 `query` 搜索关键字，在 `useEffect` 中监听 `props.query` 的变化，从而请求搜索的结果：

```tsx
// 子组件：搜索结果
const SearchResult: React.FC<{ query: string }> = (props) => {
  const [list, setList] = useState<WordType[]>([])

  useEffect(() => {
    // 如果 query 为空字符串，则清空当前的列表
    if (!props.query) return setList([])

    // 查询数据
    fetch('https://api.liulongbin.top/v1/words?kw=' + props.query)
      .then((res) => res.json())
      .then((res) => {
        // 为列表赋值
        setList(res.data)
      })
  }, [props.query])

  // 渲染列表数据
  return list.map((item) => <p key={item.id}>{item.word}</p>)
} 
```

定义父组件 `SearchBox` 并渲染 `SearchInput` 组件和 `SearchResult` 组件。在父组件中监听 `SearchInput` 的 `onChange` 事件，并把父组件中定义的处理函数 `onKwChange` 传递进去。同时，把父组件中定义的搜索关键字 `kw `传递给 `SearchResult` 组件。示例代码如下：

```tsx
// 父组件
export const SearchBox: React.FC = () => {
  const [kw, setKw] = useState('')

  const onKwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }

  return (
    <div style={{ height: 500 }}>
      <SearchInput onChange={onKwChange} />
      <hr />
      <SearchResult query={kw} />
    </div>
  )
} 
```

经过测试后，我们发现：

其实，子组件根本不需要被重新渲染，因为 `props.onChange` 函数的处理逻辑没有发生变化，只是它的引用每次都在变。为了解决这个问题，我们需要用到 `useCallback` 和 `React.memo`。

1. 每当子组件的文本框内容发生变化，都会调用 `props.onChange` 把数据发送给父组件。
2. 相应的，父组件通过 `onKwChange` 函数可以获取到子组件的值，并把值更新到 `kw` 中。当 `kw` 发生变化，会触发父组件的 `rerender`。
3. 而父组件的 `rerender` 又会重新生成 `onKwChange` 函数并把函数的引用作为 `props` 传递给子组件。
4. 这样，子组件就监听到了 `props` 的变化，最终导致子组件的 `rerender`。

其实，子组件根本不需要被重新渲染，因为 `props.onChange` 函数的处理逻辑没有发生变化，只是它的引用每次都在变。为了解决这个问题，我们需要用到 `useCallback` 和 `React.memo`。

#### 3.2 问题解决

首先，我们需要让子组件 `SearchInput` 被缓存，所以我们需要使用 `React.memo `对其进行改造：

```tsx
// 子组件：搜索框
const SearchInput: React.FC<SearchInputType> = React.memo((props) => {
  useEffect(() => {
    console.log('触发了 SearchInput 的 rerender')
  })

  return <input onChange={props.onChange} placeholder="请输入搜索关键字" />
}) 
```

使用 `React.memo` 对组件进行缓存后，如果子组件的 `props` 在两次更新前后没有任何变化，则被 `memo` 的组件不会 `rerender`。

所以为了实现 `SearchInput` 的缓存，还需要基于 `useCallback` 把父组件传递进来的 `onChange` 进行缓存。

在父组件中针对 `onKwChange` 调用 `useCallback`，示例代码如下：

```tsx
const onKwChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setKw(e.currentTarget.value)
}, [])
```

经过测试，我们发现每当文本框内容发生变化，不会导致 `SearchInput` 组件的 `rerender`。

## 12. useTransition

### 1. 问题引入

`useTransition` 可以将一个更新转为低优先级更新，使其可以被打断，不阻塞 `UI `对用户操作的响应，能够提高用户的使用体验。它常用于优化视图切换时的用户体验。

例如有以下**3**个标签页组件，分别是 `Home、Movie、About`，其中 `Movie` 是一个渲染特别耗时的组件，在渲染 `Movie` 组件期间页面的 `UI` 会被阻塞，用户会感觉页面十分卡顿，示例代码如下：

```tsx
import React, { useState } from 'react'

export const TabsContainer: React.FC = () => {
  // 被激活的标签页的名字
  const [activeTab, setActiveTab] = useState('home')

  // 点击按钮，切换激活的标签页
  const onClickHandler = (tabName: string) => {
    setActiveTab(tabName)
  }

  return (
    <div style={{ height: 500 }}>
      <TabButton isActive={activeTab === 'home'} onClick={() => onClickHandler('home')}>
        首页
      </TabButton>
      <TabButton isActive={activeTab === 'movie'} onClick={() => onClickHandler('movie')}>
        电影
      </TabButton>
      <TabButton isActive={activeTab === 'about'} onClick={() => onClickHandler('about')}>
        关于
      </TabButton>
      <hr />

      {/* 根据被激活的标签名，渲染对应的 tab 组件 */}
      {activeTab === 'home' && <HomeTab />}
      {activeTab === 'movie' && <MovieTab />}
      {activeTab === 'about' && <AboutTab />}
    </div>
  )
}

// Button 组件 props 的 TS 类型
type TabButtonType = React.PropsWithChildren & { isActive: boolean; onClick: () => void }
// Button 组件
const TabButton: React.FC<TabButtonType> = (props) => {
  const onButtonClick = () => {
    props.onClick()
  }

  return (
    <button className={['btn', props.isActive && 'active'].join(' ')} onClick={onButtonClick}>
      {props.children}
    </button>
  )
}

// Home 组件
const HomeTab: React.FC = () => {
  return <>HomeTab</>
}

// Movie 组件
const MovieTab: React.FC = () => {
  const items = Array(100000)
    .fill('MovieTab')
    .map((item, i) => <p key={i}>{item}</p>)
  return items
}

// About 组件
const AboutTab: React.FC = () => {
  return <>AboutTab</>
} 
```

配套的 `CSS` 样式为：

```tsx
.btn {
  margin: 5px;
  background-color: rgb(8, 92, 238);
  color: #fff;
  transition: opacity 0.5s ease;
}

.btn:hover {
  opacity: 0.6;
  transition: opacity 0.5s ease;
}

.btn.active {
  background-color: rgb(3, 150, 0);
}
```

### 2. 语法格式

```tsx
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ……
}
```

参数：

调用 `useTransition` 时不需要传递任何参数

返回值（数组）：

1. `isPending` 布尔值：是否存在待处理的 `transition`，如果值为 `true`，说明页面上存在待渲染的部分，可以给用户展示一个加载的提示；
2. `startTransition` 函数：调用此函数，可以把状态的更新标记为低优先级的，不阻塞 `UI` 对用户操作的响应；

### 3. 问题解决

修改 `TabsContainer` 组件，使用 `useTransition` 把点击按钮后为 `activeTab` 赋值的操作，标记为低优先级。此时 `React` 会优先响应用户对界面的其它操作，从而保证 `UI` 不被阻塞：

```tsx
import React, { useState, useTransition } from 'react'

export const TabsContainer: React.FC = () => {
  // 被激活的标签页的名字
  const [activeTab, setActiveTab] = useState('home')
  const [, startTransition] = useTransition()

  // 点击按钮，切换激活的标签页
  const onClickHandler = (tabName: string) => {
    startTransition(() => {
      setActiveTab(tabName)
    })
  }

  // 省略其它代码...
}
```

> [!TIP]
>
> 此时，点击 `Movie` 按钮后，状态的更新被标记为低优先级，`About` 按钮的 `hover` 效果和点击操作都会被立即响应。

### 4. 使用 isPending 展示加载状态

调用 `useTransition` 期间，接收 `isPending` 参数：

```tsx
const [isPending, startTransition] = useTransition() 
```

将标签页的渲染，抽离到 `renderTabs` 函数中：

```tsx
// 用于渲染标签页的函数
const renderTabs = () => {
  if (isPending) return <h3>Loading...</h3>
  switch (activeTab) {
    case 'home':
      return <HomeTab />
    case 'movie':
      return <MovieTab />
    case 'about':
      return <AboutTab />
  }
}
```

调用 `renderTabs` 函数，渲染标签页到组件中：

```tsx
{/* 标签页区域 */}
{renderTabs()}
```

### 5. 注意事项

1. 传递给 `startTransition` 的函数必须是同步的。`React` 会立即执行此函数，并将在其执行期间发生的所有状态更新标记为 `transition`。如果在其执行期间，尝试稍后执行状态更新（例如在一个定时器中执行状态更新），这些状态更新不会被标记为 `transition`；
2. 标记为 `transition` 的状态更新将被其他状态更新打断。例如在 `transition` 中更新图表组件，并在图表组件仍在重新渲染时继续在输入框中输入，`React` 将首先处理输入框的更新，之后再重新启动对图表组件的渲染工作；
3. `transition` 更新不能用于控制文本输入。

## 13. useDeferredValue

### 1. 问题引入

在搜索框案例中，`SearchResult` 组件会根据用户输入的关键字，循环生成大量的 `p` 标签，因此它是一个渲染比较耗时的组件。代码如下：

```tsx
import React, { useState } from 'react'

// 父组件
export const SearchBox: React.FC = () => {
  const [kw, setKw] = useState('')

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }

  return (
    <div style={{ height: 500 }}>
      <input type="text" value={kw} onChange={onInputChange} />
      <hr />
      <SearchResult query={kw} />
    </div>
  )
}

// 子组件，渲染列表项
const SearchResult: React.FC<{ query: string }> = (props) => {
  if (!props.query) return
  const items = Array(40000)
    .fill(props.query)
    .map((item, i) => <p key={i}>{item}</p>)

  return items
}
```

注意，此案例不能使用 `useTransition` 进行性能优化，因为 `useTransition` 会把状态更新标记为低优先级，被标记为 `transition` 的状态更新将被其他状态更新打断。因此在高频率输入时，会导致中间的输入状态丢失的问题。

```tsx
import React, { useState, useTransition } from 'react'

// 父组件
export const SearchBox: React.FC = () => {
  const [kw, setKw] = useState('')
  // 1. 调用 useTransition 函数
  const [, startTransition] = useTransition()

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 2. 将文本框状态更新标记为“低优先级”，会导致中间的输入状态丢失
    startTransition(() => {
      setKw(e.currentTarget.value)
    })
  }

  return (
    <div style={{ height: 500 }}>
      <input type="text" value={kw} onChange={onInputChange} />
      <hr />
      <SearchResult query={kw} />
    </div>
  )
}

// 子组件，渲染列表项
const SearchResult: React.FC<{ query: string }> = (props) => {
  if (!props.query) return
  const items = Array(40000)
    .fill(props.query)
    .map((item, i) => <p key={i}>{item}</p>)

  return items
}
```

### 2. 语法格式

`useDeferredValue` 提供一个 `state` 的延迟版本，根据其返回的延迟的 `state` 能够推迟更新 `UI` 中的某一部分，从而达到性能优化的目的。语法格式如下：

```tsx
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [kw, setKw] = useState('');
  // 根据 kw 得到延迟的 kw
  const deferredKw = useDeferredValue(kw);
  // ...
}
```

`useDeferredValue` 的返回值为一个延迟版的状态：

1. 在组件首次渲染期间，返回值将与传入的值相同
2. 在组件更新期间，React 将首先使用旧值重新渲染 `UI` 结构，这能够跳过某些复杂组件的 `rerender`，从而提高渲染效率。随后，`React` 将使用新值更新 `deferredValue`，并在后台使用新值重新渲染是一个低优先级的更新。这也意味着，如果在后台使用新值更新时 `value` 再次改变，它将打断那次更新。

### 3. 问题解决

按需导入 `useDeferredValue` 这个 `hooks API`，并基于它进行搜索功能的性能优化：

```tsx
// 1. 按需导入 useDeferredValue 这个 Hooks API
import React, { useState, useDeferredValue } from 'react'

// 父组件
export const SearchBox: React.FC = () => {
  const [kw, setKw] = useState('')
  // 2. 基于 kw 的值，为其创建出一个延迟版的 kw 值，命名为 deferredKw
  const deferredKw = useDeferredValue(kw)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }

  return (
    <div style={{ height: 500 }}>
      <input type="text" value={kw} onChange={onInputChange} />
      <hr />
      {/* 3. 将延迟版的 kw 值，传递给子组件使用 */}
      <SearchResult query={deferredKw} />
    </div>
  )
}

// 子组件，渲染列表项
// 4. 子组件必须使用 React.memo() 进行包裹，这样当 props 没有变化时，会跳过子组件的 rerender
const SearchResult: React.FC<{ query: string }> = React.memo((props) => {
  if (!props.query) return
  const items = Array(40000)
    .fill(props.query)
    .map((item, i) => <p key={i}>{item}</p>)

  return items
}) 
```

### 4. 表明内容已过时

当 `kw` 的值频繁更新时，`deferredKw` 的值会明显滞后，此时用户在页面上看到的列表数据并不是最新的，为了防止用户感到困惑，我们可以给内容添加 `opacity` 不透明度，表明当前看到的内容已过时。示例代码如下：

```tsx
// 1. 按需导入 useDeferredValue 这个 Hooks API
import React, { useState, useDeferredValue } from 'react'

// 父组件
export const SearchBox: React.FC = () => {
  const [kw, setKw] = useState('')
  // 2. 基于 kw 的值，为其创建出一个延迟版的 kw 值
  const deferredValue = useDeferredValue(kw)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKw(e.currentTarget.value)
  }

  return (
    <div style={{ height: 500 }}>
      <input type="text" value={kw} onChange={onInputChange} />
      <hr />
      {/* 3. 将延迟版的 kw 值，传递给子组件使用 */}
      <div style={{ opacity: kw !== deferredValue ? 0.3 : 1, transition: 'opacity 0.5s ease' }}>
        <SearchResult query={deferredValue} />
      </div>
    </div>
  )
}
```



# React 

## 1. 受控组件与非受控组件

### 受控组件

> [!IMPORTANT]
>
> 相对于表单元素而言的
>
> 什么是受控组件?
>
> 答：当给表单元素的 `value` 属性的值赋值为状态数据的时候，那么表单元素的值就受到了状态数据的控制，称为受控组件。
>
> 一旦受控，表单元素变为只读的，用户输入不可修改。如果想让用户可以输入，需要添加 `onChange` 事件，在事件回调中，获取用户最新的输入，用来给状态赋值。
>
> `type='text' `：通过 `value` 进行受控
>
> `type='radio'` : 通过 `checked` 进行受控
>
> `type='checkbox'` ： 通过 `checked` 进行受控
>
> 使用场景：
>
> 大部分使用场景都推荐使用受控组件来实现表单，因为它提供了更大的灵活性和控制力。例如，即时表单证、
>
> 根据用户输入动态改变 `UI` 等场景都非常适合使用受控组件。



> [!CAUTION]
>
> 当把状态数据，赋值给表单的 `value` 属性，该表单元素受控
> 表单受控会有以下后果：
>
> 1. 表单的内容变成**只读**的了，不能修改了
> 2. 如果受控还想能够让用户输入新内容，需要给受控的表单添加 `onChange` 事件，在 `onChange` 的事件处理函数中，获取用户最新的输入，用用户最新的输入值，给状态赋值，即可解除只读属性
> 3. 组件受控，并通过 `onChange` 绑定状态，实现了状态数据和表单值的双向绑定

```tsx
import React, {useState} from 'react';

const ControlleredComponent: React.FC = () => {
    const [value, setValue] = useState<string>('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target!.value);
    }
    
    const handleSubmit = (e: xxxx) => {
        e.preventDefault();
        console.log('Submitted value:', value);
        // ...
    }
    
    return (
    	<>
        	<form onSubmit={handleSubmit}>
        		<input type="text" value={value} onChange={handleChange} />
            	<button type="submit">Submit</button>
        	</form>
        </>
    )
}
```



### 非受控组件

> [!IMPORTANT]
>
> 什么是非受控组件：表单元素的 `value` 或 `checked` 值，**不受到状态数据的控制**
>
> 将状态数据渲染到表单中，使用 `defaultValue 、defaultChecked`
>
> 获取用户最新的输入，通过 `ref` 对象获取
>
> **使用场景**：
>
> 当需要操作其他组件的值或当受控组件的控制力过强导致某些简单场景难以实现时，可以考虑使用非受控组件。但请注意，非受控组件的控制力相对较弱，可能不适用于需要即时验证或动态改变 `UI` 的复杂场景。



```tsx
import React, {useState, useRef} from 'react';

const UnControlleredComponent: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleSubmit = (e: xxxx) => {
        e.preventDefault();
        console.log(inputRef.current.value);
        // ...
    }
    
    return (
    	<>
        	<form onSubmit={handleSubmit}>
        		<input type="text" defaultValue={value} ref={inputRef} />
            	<button type="submit"> Submit </button>
        	</form>
        </>
    )
}
```





大部分时候**推荐使用受控组件来实现表单**，因为在受控组件中，表单数据由`React`组件负责处理

如果选择非受控组件的话，控制能力较弱，表单数据就由`DOM`本身处理，但更加方便快捷，代码量少

针对两者的区别，其应用场景如下图所示：

![img](https://static.vue-js.com/f28aed20-df2f-11eb-ab90-d9ae814b240d.png)



## 2. 防止子组件重新渲染的方式

> [!IMPORTANT]
>
> 防止子组件重新渲染的方式：
>
> 1. 使用 `React.memo` 高阶组件
>
> ```tsx
> const MyComponent: React.FC = React.memo((props) => {
>     // 组件逻辑。。。
> })
> ```
>
> 
>
> 2. 使用 `useMemo` 和 `useCallback`
>    - **`useMemo`** 用于缓存计算结果。如果你有一个昂贵的计算过程，可以使用 `useMemo` 来缓存结果，只有当依赖项发生变化时才会重新计算。
>    - **`useCallback`** 用于缓存函数。它与 `useMemo` 类似，但它专门用于返回一个记忆化的函数。这有助于防止父组件传递的新函数导致子组件不必要的重新渲染。
>
> ```tsx
> const ParentComponent: React.FC = () => {
>     const [count, setCount] = useState<number>(0);
> 	
>     const memorizedCallback = useCallback(() => {
>         // 这个回调函数不会因为count的变化而改变
>     }, []);
>     
>     return <ChildComponent onSomeEvent={memoizedCallback} />;
> }
> ```
>
> 
>
> 3. 使用 `shouldComponentUpdate` 生命周期方法（类组件）
>
>    对于类组件，可以通过实现 `shouldComponentUpdate` 方法来手动控制组件是否应该重新渲染。如果返回 `false`，则组件不会重新渲染。
>
> ```tsx
> class MyComponent extends React.Component {
>   shouldComponentUpdate(nextProps, nextState) {
>     // 如果props或state没有变化，返回false
>     if (this.props.someProp === nextProps.someProp && this.state === nextState) {
>       return false;
>     }
>     return true;
>   }
> 
>   render() {
>     // 组件逻辑
>   }
> }
> ```
>
> 
>
> 4. 使用 `PureComponent` 或 `PureComponent` 类
>
>    `PureComponent` 是一个React组件基类，它实现了 `shouldComponentUpdate` 方法，进行了浅比较（shallow comparison）。如果组件的props或state没有浅层变化，那么组件就不会重新渲染。
>
>    
>
> 5. 自定义 `shouldComponentUpdate` 实现
>
>    对于更复杂的场景，你可能需要自定义 `shouldComponentUpdate` 方法，以更精确地控制何时重新渲染。
>
> **总结**
>
> 选择哪种方法取决于你的具体需求和组件的复杂性。通常，对于简单的展示组件，`React.memo` 和 `useMemo`/`useCallback` 是最常用的方法。对于复杂的类组件，`PureComponent` 或自定义 `shouldComponentUpdate` 可能更适合。



### 代码输出题

下面来看一道代码输出题

```tsx
// This is a React Quiz from BFE.dev 

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

function A({ children }) {
  console.log('A')
  const [state, setState] = useState(0)
  useEffect(() => {
    setState(state => state + 1)
  }, [])
  return children
}

function B() {
  console.log('B')
  return <C/>
}

function C() {
  console.log('C')
  return null
}

function D() {
  console.log('D')
  return null
}

function App() {
  console.log('App')
  return (
    <div>
      <A><B/></A>
      <D/>
    </div>
  )
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)
```

### 输出结果

> [!TIP]
>
> 代码输出结果为：
>
> > App
> >
> > A
> >
> > B
> >
> > C
> >
> > D
> >
> > A
>
> **解释**：
>
> 1. **App** 组件首先被渲染。在渲染过程中，`console.log('App')` 会被执行，因此我们会在控制台中看到 `"App"` 的输出。
> 2. **App** 组件内部，先遇到的是 `<A>` 组件。当 `<A>` 组件被渲染时，`console.log('A')` 被执行，因此接下来我们会看到 `"A"` 的输出。
> 3. 在 **A** 组件中，定义了一个状态变量 `state` 并使用了 `useEffect` 钩子。这个 `useEffect` 没有依赖项数组（除了空数组 `[]`），这意味着它只会在组件首次挂载时运行一次。在这个钩子里，调用了 `setState` 来更新状态值，这将导致 **A** 组件重新渲染。但是，由于这是在初始渲染后立即发生的更新，React 可能会批量处理这些更新以优化性能，所以这次状态更新不会立即引起重渲染，而是会在当前渲染周期结束后进行。
> 4. 接下来，**A** 组件继续渲染它的子组件 `<B/>`。当 `<B>` 组件被渲染时，`console.log('B')` 被执行，因此我们会在控制台中看到 `"B"` 的输出。
> 5. **B** 组件内部返回了 `<C/>` 组件。当 `<C>` 组件被渲染时，`console.log('C')` 被执行，因此我们会在控制台中看到 `"C"` 的输出。
> 6. **C** 组件返回 `null`，意味着没有实际的DOM元素被添加到页面上，但这不影响之前已经执行的 `console.log` 语句。
> 7. 回到 **App** 组件，最后 `<D/>` 组件被渲染。当 `<D>` 组件被渲染时，`console.log('D')` 被执行，因此我们会在控制台中看到 `"D"` 的输出。
> 8. 到此为止，初始渲染完成。由于在 **A** 组件中的 `useEffect` 引发了一次状态更新，React 将重新渲染 **A** 组件及其子组件。但是，在重新渲染的过程中，只有 **A** 组件相关的 `console.log` 语句会再次被执行，因为其他组件（如 **B**, **C**, 和 **D**）并没有发生任何变化，它们的状态或属性都没有改变，因此不会重新渲染。
> 9. 在 **A** 组件重新渲染时，`console.log('A')` 再次被执行，因此我们会再次看到 `"A"` 的输出。而 **A** 组件的子组件不会重新渲染，因此 `"B"`, `"C"`, 和 `"D"` 不会再次出现。



## 3. Suspense

在开始介绍 `Suspense` 前，让我们先来看一个代码输出题，请问以下代码的输出是什么？

```tsx
// This is a React Quiz from BFE.dev 

import * as React from 'react'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'

const resource = (() => {
  let data = null
  let status = 'pending'
  let fetcher = null
  return {
    get() {
      if (status === 'ready') {
        return data
      }
      if (status === 'pending') {
        fetcher = new Promise((resolve, reject) => {
          setTimeout(() => {
            data = 1
            status = 'ready'
            resolve()
          }, 100)
        })
        status = 'fetching'
      }

      throw fetcher
    }
  }
})()

function A() {
  console.log('A1')
  const data = resource.get()
  console.log('A2')
  return <p>{data}</p>
}

function Fallback() {
  console.log('fallback')
  return null
}

function App() {
  console.log('App')
  return <div>
    <Suspense fallback={<Fallback/>}>
      <A/>
    </Suspense>
  </div>
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>)

```

> [!TIP]
>
> 正确答案是：
>
> > App
> >
> > A1
> >
> > fallback
> >
> > A1
> >
> > A2
>
> 你答对了吗？

我们在讲完 `Suspense` 的用法之后，再来详细分析下上面的输出。



### 什么是 Suspense

> [!TIP]
>
> `Suspense` 是一个 React 组件，允许你在组件的子组件还在加载数据时显示一个临时或 `fallback` 界面。



### 如何使用 Suspense

我们可以使用 `Suspense` 包裹那些需要异步加载数据或懒加载的组件。

异步加载数据示例：

```tsx
import { Suspense } from 'react';

const DataComponent = () => {
  const data = resource.get(); // 这里假设 resource.get() 返回一个 promise 或抛出一个 promise
  return <div>{data}</div>;
};

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  );
};
```

在这个例子中，`Suspense` 组件会显示 `fallback` 内容（这里是 `Loading...`），直到 `DataComponent` 准备好渲染.



懒加载组件示例：

```tsx
import React, { Suspense } from 'react';

// 模拟一个异步加载的组件
const AsyncComponent = React.lazy(() => import('./AsyncComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    </div>
  );
}

export default App;
```

在这个示例中，`AsyncComponent` 是一个使用 `React.lazy` 动态加载的组件。当 `AsyncComponent` 还在加载时，`Suspense` 会显示 `<div>Loading...</div>` 作为占位内容。



### 工作原理

> [!IMPORTANT]
>
> 当 `React` 遇到一个 `Suspense` 组件时，它会检查其**子组件**是否正在等待一个 `promise resolve`。如果有子组件正在等待，`React` 会“挂起”这些组件的渲染，**其他子组件会先被渲染**，然后显示指定的 `fallback` 界面。一次 `promise` 被解析后，`React` 会**重新渲染**这些挂起的组件，并用实际的数据替代 `fallback` 界面，并且 `Suspense` 中的**所有子节点将在异步解析后重新渲染**。

在了解了 `Suspense` 的工作原理后，我们再来看开头提到的代码输出题。

> [!TIP]
>
> - 输出 `App` ：`App` 作为第一个输出是毋庸置疑的，`App` 是位于根组件的，根组件会最先渲染，因此，`App` 为第一个输出。
> - 输出 `A1` ：`<A />` 作为 `<App />` 根组件的唯一的子组件，当执行到 `<A />` 这行代码时，就会去渲染子组件，子组件中 `console.log('A1')` 作为第一个被执行的语句，因此，输出 `A1`。
> - 输出 `fallback` ：直到此时，我们的 `Suspense` 登场了，`Suspense` 会检查子组件是否正在等待一个 `promise` 而当子组件执行到 `const data = resource.get()` 这个语句时，会等待该方法返回一个 `promise`。因此，`React` 会“挂起”这些组件的渲染，并显示指定的 `fallback` 界面。输出 `fallback`。
> - 输出 `A1`：我相信大家可能会在这个输出上出错，不明白为什么会输出 `A1` 。原因很简单，就是当子组件的`promise` 被解析后，`React` 会**重新渲染**这些挂起的组件，并用实际的数据替代 `fallback` 界面。因此，就会重新渲染 `A` 组件，输出 `A1`。
> - 输出 `A2` ：接上一步，重新渲染 `A` 组件执行到 `console.log('A2')` 时，输出 `A2`。



### 数据_fetching 和懒加载

`Suspense` 可以用于管理从服务器 `fetch` 数据以及懒加载组件。例如，你可以使用 `Suspense` 显示一个加载指示器，而你的组件正在从 `API fetch` 数据。

```tsx
import { Suspense } from 'react';

const fetchApiData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data loaded!');
    }, 2000); // 模拟2秒延迟
  });
};

const DataComponent = () => {
  const apiData = fetchApiData();
  if (!apiData) throw apiData; // 如果 apiData 仍然是 promise，抛出它
  return <div>{apiData}</div>;
};

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataComponent />
    </Suspense>
  );
};
```



### 嵌套 Suspense

我们可以嵌套多个 `Suspense` 组件来控制渲染顺序。如果某些组件需要不同时间加载数据，我们可以使用嵌套的 `Suspense` 来管理这些加载状态。



### 最佳实践和常见错误

> [!CAUTION]
>
> - 使用 `Suspense` 时，避免在其内部使用 `useEffect`，因为这会破坏 `Suspense` 的目的.
> - 确保 `fallback` 组件是立即可用的，不应使用动态导入.
> - 使用 `Error Boundary` 来处理渲染错误，而不是使用 `catch` 来捕获 `promise` 的错误.



## 4. React 中的 Props 为什么是只读的？

> [!TIP]
>
> `props`原则上来讲，它只能从父组件流向子组件。React具有浓重的函数式编程的思想。
>
> 提到函数式编程就要提一个概念：**纯函数**。它有几个**特点**：
>
> - 给定相同的输入，总是返回相同的输出。
> - 过程没有副作用。
> - 不依赖外部状态。
>
> `props`就是汲取了纯函数的思想。`props` 的不可以变性就保证的相同的输入，页面显示的内容是一样的，并且不会产生副作用。



## 5. 高阶函数 HOC 的应用

1. 属性代理 —— 条件渲染

```jsx
function HOC(WrappedComponent) {
    return props => {
        props.isShow ? WrappedComponent : <p>empty</p>
    }
}
```



2. 反向继承

```jsx
const HOC = (WrappedCompoent) => {
	return class extends WrappedComponent {
        render {
            return super.render();
        }
    }   
}
```

 



3. 反向继承——实现所谓声明周期的拦截

```jsx
function HOC(WrappedComponent) {
    const didMount = WrappedComponent.prototype.componentDidMount;
    
    return class extends WrappedComponent {
        async componentDidMount() {
            if (didMount) {
                await didMount.apply(this);
            }
            
            // 自定义事件处理
            
        }
        
        render() {
            return super.render();
        }
    }
}
```



4. 反向继承——计算组件的渲染时间

```jsx
class Home entends React.Component {
    render() {
        return <h1>Hello </h1>
    }
}

function withTiming(WrappedComponent) {
    let start, end;
    
    return class extends WrappedComponent {
        constructor(props) {
            super(props);
            start = 0;
            end = 0;
        }
        
        componentWillMount() {
            if (super.componentWillMount) {
                super.componentWillMount();
            }
            start = Date.now();
        }
        
         componentDidMount() {
            if (super.componentDidMount) {
                super.componentDidMount();
            }
            end = Date.now();
             console.log('组件渲染耗时：', end - start);
        }
    }
}
```



### 属性代理和反向继承对比

1. 属性代理：从“组合”角度出发，有利于从外部操作 `wrappedComponent`，可以操作 `props`，或者在`wrappedComponent` 外加一些拦截器(如条件渲染等)
2. 反向继承：从“继承”角度出发，从内部操作 `wrappedComponent`，可以操作组件内部的 `state`，生命周期和 `render` 等功能更加强大;



## 6. React 中的闭包陷阱

> [!TIP]
>
> `React Hooks` 中的闭包陷阱主要发生在两种情况：
>
> -  在 `useState` 中使用闭包；
> - 在 `useEffect` 中使用闭包。 

### 6.1 useState 中的闭包陷阱

在 `useState` 中使用闭包，主要是因为 `useState` 的参数只会在组件挂载时执行一次。如果我们在 `useState` 中使用闭包，那么闭包中的变量值会被缓存，这意味着当我们在组件中更新状态时，闭包中的变量值不会随之更新。

在 `handleClick` 函数中，使用了 `useState` 返回的 `setCount` 函数来更新 `count` 状态值。由于 `setCount` 是在 `App` 函数中定义的，而 `handleClick` 函数可以访问 `App` 函数中定义的变量和函数，因此 `handleClick` 函数形成了一个闭包，可以访问 `App` 函数中定义的 `count` 状态值和 `setCount` 函数。

**示例**

`React Hooks` 的闭包陷阱发生在 `useState` 钩子函数中的示例，如下：

```tsx
import React, {useState} from 'react';

export const Counter: React.FC = () => {
    const [count, setCount] = useState(0);
    const handleClick = () => {
        setCount(count + 1);
    }
    const alertFn = () => {
        setTimeout(() => {
            alert(count);
        }, 300);
    }
    return (
    	<>
        	<div>
        		<p>Count: {count}</p>
            	<button onClick={handleClick}>+</button>
            	<button onClick={alertFn}>alert</button>
        	</div>
        </>
    )
}
```

> [!TIP]
>
> 上面的代码就会产生闭包陷阱，因为我们在异步函数中直接使用了 `state` ，如果我们点击了 `alert` 按钮后，在 `300ms` 内我们再次点击 `+` 按钮，更新 `state` 的值，那么，等到 `300ms` 之后，`alert` 的值还是 `300ms` 之前的值。这就是由于闭包产生的问题。
>
> 解决方案就是使用 `useRef` 配合 `useState` 来使用。
>
> 原因就是因为 `count` 是值类型，而 `countRef` 是引用类型。

```tsx
import React, {useState, useRef, useEffect} from 'react';

export const Counter: React.FC = () => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    useEffect(() => {
        countRef.current = count;
    }, [count])
    const handleClick = () => {
        setCount(count + 1);
    }
    const alertFn = () => {
        setTimeout(() => {
            alert(countRef.current);
        }, 300);
    }
    return (
    	<>
        	<div>
        		<p>Count: {count}</p>
            	<button onClick={handleClick}>+</button>
            	<button onClick={alertFn}>alert</button>
        	</div>
        </>
    )
}
```



## 7. CSS-in-JS

> [!TIP]
>
> 在 `react` 中，我们还有一种方式来实现 `css` 样式，就是通过在 `js` 里面写 `css`。
>
> 这个功能需要一个库的支持 —— `styled-components`。
>
> 安装 `pnpm i styled-components`。
>
> 使用方法：
>
> `ButtonStyleComponents.js`
>
> ```tsx
> import styled, { css } from 'styled-components';
> import { FC } from 'react';
> 
> // Button 组件
> type ButtonPropsType = {
>     primary?: boolean
> }
> 
> const Button = styled.button`
> 	background: transparent;
> 	border-radius: 3px;
> 	border: 2px solid red;
> 	color: red;
> 	margin: 0 1em;
> 	padding: 0.25em 1em;
> 	
> 	${
> 		(props: ButtonPropsType) => {
>             props.primary && css`
>             	background: red;
>             	color: white;
>             `
>         }
> 	}
> `
> 
> // Container 组件
> const Container = styled.div`
> 	text-align: center;
> `
> 
> const Demo: FC = () => {
>     return (
>     	<div>
>         	<Container>
>             	<Button>按钮</Button>
>             </Container>
>         </div>
>     )
> }
> ```
>
> 



