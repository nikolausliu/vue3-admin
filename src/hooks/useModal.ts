import { createVNode } from 'vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

interface ModalOptions {
  title: string
  content: string
}

export default function useModal() {
  function confirm(modalOptions: ModalOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      Modal.confirm({
        title: modalOptions.title,
        icon: createVNode(ExclamationCircleOutlined),
        content: modalOptions.content,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          resolve()
        },
        onCancel: () => {
          reject(new Error())
        },
      })
    })
  }

  return {
    confirm,
  }
}
