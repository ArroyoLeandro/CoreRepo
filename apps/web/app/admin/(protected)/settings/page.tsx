import { cookies } from "next/headers";
import { createServerApi } from "../../../../lib/api";
import styles from "../../admin.module.css";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((entry) => `${entry.name}=${entry.value}`)
    .join("; ");

  const api = createServerApi(cookieHeader);
  const settings = await api.getSettings();

  return (
    <div className={styles.panelWide}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.muted}>
        Read-only surface for current defaults (theme/locale persist in PR5).
      </p>
      <dl className={styles.dl}>
        <div>
          <dt>Locale</dt>
          <dd data-testid="settings-locale">{settings.locale}</dd>
        </div>
        <div>
          <dt>Theme</dt>
          <dd data-testid="settings-theme">{settings.theme}</dd>
        </div>
      </dl>
    </div>
  );
}
