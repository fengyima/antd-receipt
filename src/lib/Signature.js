let preHandler = function(e) {
    e.preventDefault();
    e.stopPropagation();
};
export default class Signature {
    constructor(el) {
        this.el = el;
        this.canvas = el;
        this.cxt = this.canvas.getContext("2d");
        this.stage_info = this.canvas.getBoundingClientRect();
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        };
    }
    init(btn) {
        this.canvas.addEventListener("touchstart", event => {
            preHandler(event);
            // document.addEventListener("touchstart", preHandler, false);
            this.drawBegin(event);
        });
        this.canvas.addEventListener("touchmove", event => {
            preHandler(event);
            this.drawing(event);
        });
        this.canvas.addEventListener("touchend", event => {
            preHandler(event);
            // document.addEventListener("touchend", preHandler, false);
            this.drawEnd();
        });
        this.clear(btn);
    }
    drawBegin(e) {
        window.getSelection()
            ? window.getSelection().removeAllRanges()
            : document.selection.empty();
        this.cxt.strokeStyle = "#000";
        this.cxt.beginPath();
        this.cxt.moveTo(
            e.changedTouches[0].clientX - this.stage_info.left,
            e.changedTouches[0].clientY - this.stage_info.top
        );
        this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left;
        this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top;
    }
    drawing(e) {
        this.cxt.lineTo(
            e.changedTouches[0].clientX - this.stage_info.left,
            e.changedTouches[0].clientY - this.stage_info.top
        );
        this.path.endX = e.changedTouches[0].clientX - this.stage_info.left;
        this.path.endY = e.changedTouches[0].clientY - this.stage_info.top;
        this.cxt.stroke();
    }
    drawEnd() {
        document.removeEventListener("touchstart", preHandler, false);
        document.removeEventListener("touchend", preHandler, false);
        document.removeEventListener("touchmove", preHandler, false);
        //this.canvas.ontouchmove = this.canvas.ontouchend = null
    }
    clear(btn) {
        this.cxt.clearRect(0, 0, 1000, 1000);
    }
    save() {
        return this.canvas.toDataURL("image/png");
    }
}
