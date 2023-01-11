export enum StatisticalCardStatusEnum {
  SUCCESS = 'Успешно загружена',
  ERROR = 'Ошибка при загрузке',
  IN_PROCESS = 'В обработке',
  SENT_TO_DIRECTOR = 'Направлена руководителю',
  UNDER_DIRECTOR_CONSIDERATION = 'На рассмотрении у руководителя',
  ON_REDRAWING = 'На пересоставлении',
  SENT_TO_PROSECUTOR = 'Направлена прокурору',
  UNDER_PROSECUTOR_CONSIDERATION = 'На рассмотрении у прокурора',
  APPROVED_BY_PROSECUTOR = 'Утверждена прокурором',
  LOADED_BY_INVESTIGATOR = 'Загружена следователем',
  LOADED_BY_DIRECTOR = 'Загружена руководителем',
  LOADED_BY_PROSECUTOR = 'Загружена прокурором',
  REPEAT_UPLOAD = 'Повторная загрузка',
  FLK_ERRORS = 'Загружена с ошибками ФЛК',
  DELAY_UPLOAD = 'Отложенная загрузка',
  RECALLED_BY_DEPARTMENT = 'Отозвана ведомством',
  INCORRECT_SIGNATURE = 'Электронная подпись некорректна',
  INVALID_CERTIFICATE = 'Сертификат недействителен',
  FOUND_FLK_ERRORS = 'Обнаружены ошибки ФЛК',
  SHOULD_BE_TAKEN_TO_COURT = 'Следует направить сведения в суд',
  SENT_TO_COURT = 'Сведения направлены в суд',
  ADJUSTMENT_REQUIRED = 'Требуется корректировка',
  REGISTER = 'Направить на учет',
  COURT_DECISION_TAKEN = 'Решение суда учтено в ГАС ПС',
  CASE_REGISTERED = 'Дело зарегистрировано в суде',
}
