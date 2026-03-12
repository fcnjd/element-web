/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import { type MatrixEvent, type Room, MsgType, EventType } from "matrix-js-sdk/src/matrix";

import { _t } from "../languageHandler";
import { formatTime } from "../DateUtils";

/**
 * Computes a human-readable accessible label for a Matrix event suitable for
 * use as an `aria-label` on the event tile element.
 */
export function getEventAriaLabel(mxEvent: MatrixEvent, room: Room | undefined, isTwelveHour?: boolean): string {
    const sender = mxEvent.sender?.name ?? mxEvent.getSender() ?? _t("presence|unknown");
    const time = formatTime(new Date(mxEvent.getTs()), isTwelveHour);

    if (mxEvent.isRedacted()) {
        return _t("timeline|aria_label|redacted");
    }

    if (mxEvent.isDecryptionFailure()) {
        return _t("timeline|aria_label|decryption_failure");
    }

    const content = mxEvent.getContent();
    let body: string;

    if (mxEvent.getType() === EventType.RoomMessage || mxEvent.getType() === EventType.Sticker) {
        const msgtype = content.msgtype;
        if (msgtype === MsgType.Text || msgtype === MsgType.Notice || msgtype === MsgType.Emote) {
            body = content.body ?? "";
        } else if (msgtype === MsgType.Image) {
            body = content.body
                ? _t("timeline|aria_label|image", { name: content.body })
                : _t("timeline|aria_label|image_generic");
        } else if (msgtype === MsgType.Video) {
            body = content.body
                ? _t("timeline|aria_label|video", { name: content.body })
                : _t("timeline|aria_label|video_generic");
        } else if (msgtype === MsgType.Audio) {
            body = content.body
                ? _t("timeline|aria_label|audio", { name: content.body })
                : _t("timeline|aria_label|audio_generic");
        } else if (msgtype === MsgType.File) {
            body = content.body
                ? _t("timeline|aria_label|file", { name: content.body })
                : _t("timeline|aria_label|file_generic");
        } else {
            body = content.body ?? _t("timeline|aria_label|event_generic");
        }
    } else {
        body = _t("timeline|aria_label|event_generic");
    }

    // Check for reply
    const relatesTo = mxEvent.getWireContent()?.["m.relates_to"];
    const replyToId = relatesTo?.["m.in_reply_to"]?.event_id;
    if (replyToId && !relatesTo?.is_falling_back) {
        const replyEvent = room?.findEventById(replyToId);
        if (replyEvent) {
            const quotedSender = replyEvent.sender?.name ?? replyEvent.getSender() ?? _t("presence|unknown");
            const quotedContent = replyEvent.getContent();
            const quotedBody = quotedContent.body ?? "";
            return _t("timeline|aria_label|message_with_reply", { sender, body, quotedSender, quotedBody, time });
        }
    }

    return _t("timeline|aria_label|message", { sender, body, time });
}
