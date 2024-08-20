export function CountrySelect({ value = 'JP', onChange }) {
  return (
    <select
      className="mb-2 bg-black border-green-200"
      value={value}
      onChange={onChange}
    >
      <option className="py-1" value="JP">
        JP
      </option>
      <option className="py-1" value="TW">
        TW
      </option>
      <option className="py-1" value="KR">
        KR
      </option>
      <option className="py-1" value="US">
        US
      </option>
    </select>
  )
}
