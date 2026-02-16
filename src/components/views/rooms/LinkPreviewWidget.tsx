/*
Copyright 2024, 2025 New Vector Ltd.
Copyright 2016-2021 The Matrix.org Foundation C.I.C.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { type JSX, type ComponentProps, createRef, type ReactNode } from "react";

import { Linkify } from "../../../HtmlUtils";
import Modal from "../../../Modal";
import * as ImageUtils from "../../../ImageUtils";
import ImageView from "../elements/ImageView";
import LinkWithTooltip from "../elements/LinkWithTooltip";
import PlatformPeg from "../../../PlatformPeg";
import type { UrlPreviewViewSnapshotInterfacePreview } from "../../../viewmodels/message-body/UrlPreviewViewModel";

interface IProps {
    preview: UrlPreviewViewSnapshotInterfacePreview;
    children?: ReactNode;
    mediaVisible: boolean;
}

export default class LinkPreviewWidget extends React.Component<IProps> {
    private image = createRef<HTMLImageElement>();

    private onImageClick = (ev: React.MouseEvent): void => {
        const p = this.props.preview;
        if (ev.button != 0 || ev.metaKey) return;
        ev.preventDefault();

        if (!p.image?.imageFull) {
            return;
        }

        const params: Omit<ComponentProps<typeof ImageView>, "onFinished"> = {
            src: p.image.imageFull,
            width: p.image.width,
            height: p.image.height,
            name: p.title,
            fileSize: p.image.size,
            link: p.link,
        };

        if (this.image.current) {
            const clientRect = this.image.current.getBoundingClientRect();

            params.thumbnailInfo = {
                width: clientRect.width,
                height: clientRect.height,
                positionX: clientRect.x,
                positionY: clientRect.y,
            };
        }

        Modal.createDialog(ImageView, params, "mx_Dialog_lightbox", undefined, true);
    };

    public render(): React.ReactNode {
        const p = this.props.preview;

        let img: JSX.Element | undefined;
        // Don't render a button to show the image, just hide it outright
        if (p.image?.imageThumb && this.props.mediaVisible) {
            const imageMaxWidth = 100;
            const imageMaxHeight = 100;
            const thumbHeight =
                ImageUtils.thumbHeight(p.image?.width, p.image?.height, imageMaxWidth, imageMaxHeight) ??
                imageMaxHeight;
            img = (
                <div className="mx_LinkPreviewWidget_image" style={{ height: thumbHeight }}>
                    <img
                        ref={this.image}
                        style={{ maxWidth: imageMaxWidth, maxHeight: imageMaxHeight }}
                        src={p.image.imageThumb}
                        onClick={this.onImageClick}
                        alt=""
                    />
                </div>
            );
        }

        // The description includes &-encoded HTML entities, we decode those as React treats the thing as an
        // opaque string. This does not allow any HTML to be injected into the DOM.
        const anchor = (
            <a href={p.link} target="_blank" rel="noreferrer noopener">
                {p.title}
            </a>
        );
        const needsTooltip = PlatformPeg.get()?.needsUrlTooltips() && p.link !== p.title;

        return (
            <div className="mx_LinkPreviewWidget">
                <div className="mx_LinkPreviewWidget_wrapImageCaption">
                    {img}
                    <div className="mx_LinkPreviewWidget_caption">
                        <div className="mx_LinkPreviewWidget_title">
                            {needsTooltip ? (
                                <LinkWithTooltip tooltip={new URL(p.link, window.location.href).toString()}>
                                    {anchor}
                                </LinkWithTooltip>
                            ) : (
                                anchor
                            )}
                            {p.siteName && <span className="mx_LinkPreviewWidget_siteName">{" - " + p.siteName}</span>}
                        </div>
                        <div className="mx_LinkPreviewWidget_description">
                            <Linkify>{p.description}</Linkify>
                        </div>
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}
