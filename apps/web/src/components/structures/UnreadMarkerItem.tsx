/*
Copyright 2024 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type RefObject } from "react";
// Note: createRef<T> in this project returns RefObject<T | null>
import { type Room } from "matrix-js-sdk/src/matrix";

import { _t } from "../../languageHandler";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

interface Props {
    room: Room | undefined;
    visible: boolean;
    isActiveNavTarget: boolean;
    liRef: RefObject<HTMLLIElement | null>;
    scrollToken: string;
}

/**
 * A focusable list item representing the unread message marker in the timeline.
 * Used as a roving-tabindex navigation target for screen reader users.
 */
export const UnreadMarkerItem: React.FC<Props> = ({ room, visible, isActiveNavTarget, liRef, scrollToken }) => {
    const { count } = useUnreadNotifications(room);

    const ariaLabel =
        count > 0
            ? _t("timeline|unread_marker_label", { count })
            : _t("timeline|unread_marker_label_fallback");

    return (
        <li
            ref={liRef}
            className="mx_MessagePanel_myReadMarker"
            data-scroll-tokens={scrollToken}
            tabIndex={isActiveNavTarget ? 0 : -1}
            aria-label={ariaLabel}
        >
            {visible && <hr style={{ opacity: 1, width: "99%" }} />}
        </li>
    );
};
