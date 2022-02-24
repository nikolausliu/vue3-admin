import { App } from 'vue'
import {
  ConfigProvider,
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Radio,
  Cascader,
  Checkbox,
  DatePicker,
  TimePicker,
  Statistic,
  Table,
  Row,
  Col,
  Modal,
  Tabs,
  Divider,
  Card,
  Alert,
  Empty,
  Image,
  Popconfirm,
  Descriptions,
  Badge,
  Dropdown,
  Layout,
  Menu,
  Upload,
  Spin,
  Tooltip,
  Tag,
  Tree,
  Steps,
} from 'ant-design-vue'
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  MinusOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  InfoCircleOutlined,
  CopyOutlined,
  DownOutlined,
  EyeOutlined,
  UploadOutlined,
  LoadingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
  UserOutlined,
  LockOutlined,
  SyncOutlined,
  ArrowLeftOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons-vue'

export function installAnt(app: App): App {
  app.use(ConfigProvider)
  app.use(Button)
  app.use(Form)
  app.use(Input)
  app.use(InputNumber)
  app.use(Switch)
  app.use(Select)
  app.use(Radio)
  app.use(Cascader)
  app.use(Checkbox)
  app.use(DatePicker)
  app.use(TimePicker)
  app.use(Statistic)
  app.use(Table)
  app.use(Row)
  app.use(Col)
  app.use(Modal)
  app.use(Tabs)
  app.use(Divider)
  app.use(Card)
  app.use(Alert)
  app.use(Empty)
  app.use(Image)
  app.use(Popconfirm)
  app.use(Descriptions)
  app.use(Badge)
  app.use(Dropdown)
  app.use(Layout)
  app.use(Menu)
  app.use(Upload)
  app.use(Spin)
  app.use(Tooltip)
  app.use(Tag)
  app.use(Tree)
  app.use(Steps)
  // icons
  app.component(SearchOutlined.displayName, SearchOutlined)
  app.component(EditOutlined.displayName, EditOutlined)
  app.component(DeleteOutlined.displayName, DeleteOutlined)
  app.component(DownloadOutlined.displayName, DownloadOutlined)
  app.component(PlusOutlined.displayName, PlusOutlined)
  app.component(PlusCircleOutlined.displayName, PlusCircleOutlined)
  app.component(MinusOutlined.displayName, MinusOutlined)
  app.component(CheckOutlined.displayName, CheckOutlined)
  app.component(CloseOutlined.displayName, CloseOutlined)
  app.component(PlusSquareOutlined.displayName, PlusSquareOutlined)
  app.component(MinusSquareOutlined.displayName, MinusSquareOutlined)
  app.component(InfoCircleOutlined.displayName, InfoCircleOutlined)
  app.component(CopyOutlined.displayName, CopyOutlined)
  app.component(DownOutlined.displayName, DownOutlined)
  app.component(EyeOutlined.displayName, EyeOutlined)
  app.component(UploadOutlined.displayName, UploadOutlined)
  app.component(LoadingOutlined.displayName, LoadingOutlined)
  app.component(ArrowUpOutlined.displayName, ArrowUpOutlined)
  app.component(ArrowDownOutlined.displayName, ArrowDownOutlined)
  app.component(QuestionCircleOutlined.displayName, QuestionCircleOutlined)
  app.component(WarningOutlined.displayName, WarningOutlined)
  app.component(UserOutlined.displayName, UserOutlined)
  app.component(LockOutlined.displayName, LockOutlined)
  app.component(SyncOutlined.displayName, SyncOutlined)
  app.component(ArrowLeftOutlined.displayName, ArrowLeftOutlined)
  app.component(CaretUpOutlined.displayName, CaretUpOutlined)
  app.component(CaretDownOutlined.displayName, CaretDownOutlined)
  return app
}
