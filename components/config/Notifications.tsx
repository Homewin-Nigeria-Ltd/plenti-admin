"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Notifications() {
  const [loginAttempts, setLoginAttempts] = React.useState("email");
  const [pushNotifications, setPushNotifications] = React.useState("do-not-notify");
  const [reminders, setReminders] = React.useState("all-reminders");
  const [newsUpdates, setNewsUpdates] = React.useState(true);
  const [tipsTutorials, setTipsTutorials] = React.useState(true);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="w-full lg:w-64 shrink-0">
        <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
          Preference
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500">
          Set the preference for your account and get notified at any time there&apos;s an update.
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
                These are notifications to notify you when your account is being accessed.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup value={loginAttempts} onValueChange={setLoginAttempts}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="login-email" />
                  <Label htmlFor="login-email" className="font-normal cursor-pointer">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="push" id="login-push" />
                  <Label htmlFor="login-push" className="font-normal cursor-pointer">
                    Push Notification
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="login-sms" />
                  <Label htmlFor="login-sms" className="font-normal cursor-pointer">
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
                These are notifications generated when the app is not open, notifying you of new update, news and messages.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup value={pushNotifications} onValueChange={setPushNotifications}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-not-notify" id="push-do-not" />
                  <Label htmlFor="push-do-not" className="font-normal cursor-pointer">
                    Do not notify me
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all-reminders" id="push-all" />
                  <div>
                    <Label htmlFor="push-all" className="font-normal cursor-pointer">
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
                These are notifications to remind you of updates you might have missed.
              </p>
            </div>
            <div className="lg:flex-1">
              <RadioGroup value={reminders} onValueChange={setReminders}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-not-notify" id="reminder-do-not" />
                  <Label htmlFor="reminder-do-not" className="font-normal cursor-pointer">
                    Do not notify me
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="important-only" id="reminder-important" />
                  <div>
                    <Label htmlFor="reminder-important" className="font-normal cursor-pointer">
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
                    <Label htmlFor="reminder-all" className="font-normal cursor-pointer">
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

          <div className="pt-4 border-t border-neutral-100 flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
            <div className="lg:flex-1">
              <h3 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
                Email Notification
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500">
                Receive the latest news, updates and industry tutorials from us.
              </p>
            </div>
            <div className="lg:flex-1">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="news-updates"
                    checked={newsUpdates}
                    onCheckedChange={(checked) => setNewsUpdates(checked === true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="news-updates" className="font-normal cursor-pointer">
                      News and updates
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      News about product and feature updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="tips-tutorials"
                    checked={tipsTutorials}
                    onCheckedChange={(checked) => setTipsTutorials(checked === true)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="tips-tutorials" className="font-normal cursor-pointer">
                      Tips and tutorials
                    </Label>
                    <p className="text-xs text-neutral-500 mt-1">
                      Tips on getting more out of Untitled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

