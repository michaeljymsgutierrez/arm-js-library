/**
 * ArmLogo
 *
 * "icon" is the square hexagon mark alone; "landscape" is the official
 * icon+wordmark lockup, sized by height so it scales cleanly at any navbar
 * or header size without distorting its aspect ratio.
 */
const ArmLogo = ({ variant = 'landscape', height = 28 }) => {
  if (variant === 'icon') {
    return (
      <img src="/logo-icon.png" alt="ARM JS" height={height} style={{ height, width: 'auto', display: 'block' }} />
    )
  }

  return (
    <img
      src="/logo-landscape.png"
      alt="ARM JS"
      height={height}
      style={{ height, width: 'auto', display: 'block' }}
    />
  )
}

export default ArmLogo
