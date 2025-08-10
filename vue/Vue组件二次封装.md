# 关于Vue 二次封装


$attrs 包含事件和属性

1. 属性如何穿透
2. 插槽如何穿透
3. 组件方法如何暴露

```
<template>
  <div>
    <el-input v-bind="{...$attrs,...props}"></el-input>
  </div>
</template>

<script lang="ts" setup>
import type {InputProps} from 'element-plus'
const props = defineProps<InputProps>()
</script>
```



# 插槽
```
<template>
  <div>
    <component is="{h(ElInput),{...$attrs,...props},$slots}"></component>
  </div>
</template>

<script lang="ts" setup>
import type {InputProps} from 'element-plus'
const props = defineProps<InputProps>()
</script>
```



# 方法
```
<template>
  <div>
    <component is="{h(ElInput),{...$attrs,...props,ref:changeRef},$slots}"></component>
  </div>
</template>

<script lang="ts" setup>
import type {InputProps} from 'element-plus'
const props = defineProps<InputProps>()
const vm = getCurrentInstance()
// 类似definedExpose
function changeRef (inputinstance){
  vm.exposed = inputinstance
}

</script>
```
