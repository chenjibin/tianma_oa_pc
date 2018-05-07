/**
 * 木桶布局
 *
 * @param {string} selector
 * @param {int} [minHeight=400]
 * @constructor
 */
export default class GalleryColumns {
    constructor(selector, minHeight = 400) {
        this.element = document.querySelector(selector);
        this.minAspectRatio = this.element.clientWidth / minHeight;
        this.padding = 8;
        this.photos = [];
    }
    append(photos) {
        const self = this;

        this.getRows(photos).forEach(function (row) {
            let totalWidth = self.element.clientWidth - (row.photos.length - 1) * self.padding;
            let $row = document.createElement('div');
            $row.className = 'gallery-row';
            $row.style.height = parseInt(totalWidth / row.aspectRatio) + 'px';
            $row.innerHTML = row.photos.reduce(function (html, photo) {
                html +=
                    `
                    <div class="gallery-item-wrapper">
                        <div class="gallery-item">
                            <img src="${photo.img}" class="gallery-image"/>
                        </div>
                    </div>
                    `;
                return html;
            }, '');
            self.element.appendChild($row);
        });
    }
    getRows(photos) {
        // 合并上次剩下的相片
        photos = this.photos.concat(photos);

        let aspectRatio = 0;
        let rows = [];
        let _photos = [];

        for (let i = 0, plength = photos.length; i < plength; i++) {
            _photos.push(photos[i]);
            aspectRatio += photos[i].width / photos[i].height;

            if (aspectRatio > this.minAspectRatio) {
                rows.push({
                    aspectRatio: aspectRatio,
                    photos: _photos
                });
                _photos = [];
                aspectRatio = 0;
            }
        }

        // 剩下的相片留到下一次
        this.photos = _photos;
        return rows;
    }
}
