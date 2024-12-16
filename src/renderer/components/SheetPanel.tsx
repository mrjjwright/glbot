import DatePicker from './DatePicker'
import Panel from './Panel'

const SheetPanel = () => {
  return (
    <Panel title="Sheet">
      <div className="SheetPanel_root">
        <div className="SheetPanel_sidebar">
          <DatePicker />
        </div>
      </div>
    </Panel>
  )
}

export default SheetPanel
