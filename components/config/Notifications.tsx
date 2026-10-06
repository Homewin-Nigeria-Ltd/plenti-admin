"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import type { NotificationPreferenceSettings } from "@/types/NotificationTypes";

type LoginChoice = "email" | "push" | "sms";
type PushChoice = "do-not-notify" | "all-reminders";
type ReminderChoice = "do-not-notify" | "important-only" | "all-reminders";

function loginChoiceFromSettings(
  settings: NotificationPreferenceSettings["login_attempts"]
): LoginChoice {
  if (settings.email) return "email";
  if (settings.push) return "push";
  if (settings.sms) return "sms";
  return "email";
}

function pushChoiceFromSettings(
  settings: NotificationPreferenceSettings["push_notifications"]
): PushChoice {
  if (settings.do_not_notify) return "do-not-notify";
  return "all-reminders";
}

function reminderChoiceFromSettings(
  settings: NotificationPreferenceSettings["reminders"]
): ReminderChoice {
  if (settings.do_not_notify) return "do-not-notify";
  if (settings.important_reminders_only) return "important-only";
  return "all-reminders";
}

function toPayload(
  loginAttempts: LoginChoice,
  pushNotifications: PushChoice,
  reminders: ReminderChoice
): NotificationPreferenceSettings {
  return {
    login_attempts: {
      email: loginAttempts === "email",
      push: loginAttempts === "push",
      sms: loginAttempts === "sms",
    },
    push_notifications: {
      do_not_notify: pushNotifications === "do-not-notify",
      all_reminders: pushNotifications === "all-reminders",
    },
    reminders: {
      do_not_notify: reminders === "do-not-notify",
      important_reminders_only: reminders === "important-only",
      all_reminders: reminders === "all-reminders",
    },
  };
}

export default function Notifications() {
  const {
    notificationSettings,
    loadingNotificationSettings,
    savingNotificationSettings,
    notificationSettingsError,
    fetchNotificationSettings,
    updateNotificationSettings,
  } = useNotificationsStore();

  const [loginAttempts, setLoginAttempts] =
    React.useState<LoginChoice>("email");
  const [pushNotifications, setPushNotifications] =
    React.useState<PushChoice>("do-not-notify");
  const [reminders, setReminders] =
    React.useState<ReminderChoice>("all-reminders");

  React.useEffect(() => {
    void fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  React.useEffect(() => {
    if (!notificationSettings) return;
    setLoginAttempts(
      loginChoiceFromSettings(notificationSettings.login_attempts)
    );
    setPushNotifications(
      pushChoiceFromSettings(notificationSettings.push_notifications)
    );
    setReminders(reminderChoiceFromSettings(notificationSettings.reminders));
  }, [notificationSettings]);

  const handleSave = async () => {
    const ok = await updateNotificationSettings(
      toPayload(loginAttempts, pushNotifications, reminders)
    );
    if (ok) {
      toast.success("Notification preferences saved");
    }
  };

  if (loadingNotificationSettings && !notificationSettings) {
    return (
      <div className="flex items-center justify-center py-12 text-primary-600">
        Loading notification preferences…
      </div>
    );
  }

  if (notificationSettingsError && !notificationSettings) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {notificationSettingsError}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="w-full lg:w-64 shrink-0">
        <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
          Preference
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          Set the preference for your account and get notified at any time
          there&apos;s an update.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg  p-4 sm:p-6 space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            <div className="lg:flex-1">
              <h3 className="font-semibold text-primary-700 text-lg mb-2">
                Login attempts
              </h3>
              <p className="text-sm text-neutral-500">
                These are notifications to notify you when your account is being
                accessed.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup
                value={loginAttempts}
                onValueChange={(value) =>
                  setLoginAttempts(value as LoginChoice)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="login-email" />
                  <Label
                    htmlFor="login-email"
                    className="font-normal cursor-pointer"
                  >
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="push" id="login-push" />
                  <Label
                    htmlFor="login-push"
                    className="font-normal cursor-pointer"
                  >
                    Push Notification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="login-sms" />
                  <Label
                    htmlFor="login-sms"
                    className="font-normal cursor-pointer"
                  >
                    SMS
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            <div className="lg:flex-1">
              <h3 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
                Push Notifications
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                These are notifications generated when the app is not open,
                notifying you of new update, news and messages.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup
                value={pushNotifications}
                onValueChange={(value) =>
                  setPushNotifications(value as PushChoice)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-not-notify" id="push-do-not" />
                  <Label
                    htmlFor="push-do-not"
                    className="font-normal cursor-pointer"
                  >
                    Do not notify me
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all-reminders" id="push-all" />
                  <div>
                    <Label
                      htmlFor="push-all"
                      className="font-normal cursor-pointer"
                    >
                      All reminders
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      Notify me for all other activity.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            <div className="lg:flex-1">
              <h3 className="font-semibold text-primary-700 text-lg mb-2">
                Reminders
              </h3>
              <p className="text-sm text-neutral-500">
                These are notifications to remind you of updates you might have
                missed.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup
                value={reminders}
                onValueChange={(value) =>
                  setReminders(value as ReminderChoice)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-not-notify" id="reminder-do-not" />
                  <Label
                    htmlFor="reminder-do-not"
                    className="font-normal cursor-pointer"
                  >
                    Do not notify me
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="important-only"
                    id="reminder-important"
                  />
                  <div>
                    <Label
                      htmlFor="reminder-important"
                      className="font-normal cursor-pointer"
                    >
                      Important reminders only
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      Only notify me if the reminder is tagged as important.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all-reminders" id="reminder-all" />
                  <div>
                    <Label
                      htmlFor="reminder-all"
                      className="font-normal cursor-pointer"
                    >
                      All reminders
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      Notify me for all reminders.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2">
          <Button
            className="btn btn-group-item btn-primary"
            onClick={handleSave}
            disabled={savingNotificationSettings}
          >
            {savingNotificationSettings ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
