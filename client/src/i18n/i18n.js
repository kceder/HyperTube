// import the translations files
import englishTranslations from '../i18n/english.json'
import finnishTranslations from '../i18n/finnish.json'
import italianTranslations from '../i18n/italian.json'

// object containing the translations.
const translations = {
  en: englishTranslations,
  fi: finnishTranslations,
  it: italianTranslations
}

/** It allows to use strings like 'prop1.prop2.prop3' to access the values
* of properties in objects, no matter how many levels are nested.
*
*  @param1 {String} The language selected in global state ('en', 'it', etc)
*  @param2 {String} The path to the value of the property we're interested in,
*          for example, 'messages.login.success'
*  @return {String} The value of the property we're interested in.
*/
function t(activeLanguage, path) {
  // array of keys ['messages', 'login', 'success']
  const properties = path.split('.')
  return properties.reduce((prev, curr) => prev?.[curr], translations[activeLanguage])
}
export default t