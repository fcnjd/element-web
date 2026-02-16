/*
Copyright 2024, 2025 New Vector Ltd.
Copyright 2021 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type JSX } from "react";
import { type MatrixEvent } from "matrix-js-sdk/src/matrix";
import CloseIcon from "@vector-im/compound-design-tokens/assets/web/icons/close";
import { useViewModel } from "@element-hq/web-shared-components";

import LinkPreviewWidget from "./LinkPreviewWidget";
import AccessibleButton from "../elements/AccessibleButton";
import { _t } from "../../../languageHandler";
import { useMediaVisible } from "../../../hooks/useMediaVisible";
import type { UrlPreviewViewModel } from "../../../viewmodels/message-body/UrlPreviewViewModel";

interface IProps {
    vm: UrlPreviewViewModel;
    mxEvent: MatrixEvent;
}

const LinkPreviewGroup: React.FC<IProps> = ({ vm, mxEvent }) => {
    const { previews, hidden, totalPreviewCount, previewsLimited, overPreviewLimit } = useViewModel(vm);
    const [mediaVisible] = useMediaVisible(mxEvent);
    if (hidden) {
        return null;
    }

    let toggleButton: JSX.Element | undefined;
    if (overPreviewLimit) {
        toggleButton = (
            <AccessibleButton onClick={() => vm.onTogglePreviewLimit()}>
                {previewsLimited
                    ? _t("timeline|url_preview|show_n_more", { count: totalPreviewCount - previews.length })
                    : _t("action|collapse")}
            </AccessibleButton>
        );
    }

    return (
        <div className="mx_LinkPreviewGroup">
            {previews.map((preview, i) => (
                <LinkPreviewWidget mediaVisible={mediaVisible} key={preview.link} preview={preview}>
                    {i === 0 ? (
                        <AccessibleButton
                            className="mx_LinkPreviewGroup_hide"
                            onClick={() => vm.onHideClick()}
                            aria-label={_t("timeline|url_preview|close")}
                        >
                            <CloseIcon width="20px" height="20px" />
                        </AccessibleButton>
                    ) : undefined}
                </LinkPreviewWidget>
            ))}
            {toggleButton}
        </div>
    );
};

export default LinkPreviewGroup;
