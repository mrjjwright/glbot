import { Schema } from 'effect'

const ParameterData = Schema.Data(
  Schema.Struct({
    name: Schema.String,
    value: Schema.Unknown
  })
)

const LineData = Schema.Data(
  Schema.Struct({
    id: Schema.String,
    type: Schema.Literal('parameter', 'tile', 'operation'),
    content: Schema.Unknown
  })
)

const TileData = Schema.Data(
  Schema.Struct({
    id: Schema.String,
    label: Schema.String,
    lines: Schema.Array(LineData)
  })
)

type TileDataSchema = Schema.Schema.Type<typeof TileData>
type LineDataSchema = Schema.Schema.Type<typeof LineData>
type ParameterDataSchema = Schema.Schema.Type<typeof ParameterData>

export { TileData, LineData, ParameterData, TileDataSchema, LineDataSchema, ParameterDataSchema }
