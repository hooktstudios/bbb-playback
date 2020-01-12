import React, { Component } from 'react';
import './index.scss';

export default class Whiteboard extends Component {
  renderPolyline(style, data) {
    return <polyline
      style={style}
      points={data.points}
    />;
  }

  renderLine(style, data) {
    return <line
      style={style}
      x1={data.x1}
      y1={data.y1}
      x2={data.x2}
      y2={data.y2}
    />;
  }

  renderPolygon(style, data) {
    return <polygon
      style={style}
      points={data.points}
    />;
  }

  renderPath(style, data) {
    return <path
      style={style}
      d={data.d}
    />;
  }

  renderCircle(style, data) {
    return <circle
      style={style}
      cx={data.cx}
      cy={data.cy}
      r={data.r}
    />;
  }

  renderSwitch(style, data) {
    return (
      <foreignObject
        style={style}
        height={data.height}
        width={data.width}
        x={data.x}
        y={data.y}
      >
        <p xmlns="http://www.w3.org/1999/xhtml">
          {data.p}
        </p>
      </foreignObject>
    );
  }

  renderWhiteboard(draws, time) {
    const whiteboard = [];

    for (let i = 0; i < draws.length; i++) {
      const {
        clear,
        id,
        shape,
        style,
        timestamp,
      } = draws[i];

      if (timestamp >= time) break;

      const j = i + 1;
      let intermediate = false;
      if (j < draws.length && draws[j].timestamp < time) {
        intermediate = draws[j].id === id;
      }

      const cleared = clear !== -1 && clear < time;
      const visible = !cleared && !intermediate;
      if (!visible) continue;

      const {
        data,
        type,
      } = shape;

      switch (type) {
        case 'polyline':
          whiteboard.push(this.renderPolyline(style, data));
          break;
        case 'line':
          whiteboard.push(this.renderLine(style, data));
          break;
        case 'polygon':
          whiteboard.push(this.renderPolygon(style, data));
          break;
        case 'path':
          whiteboard.push(this.renderPath(style, data));
          break;
        case 'circle':
          whiteboard.push(this.renderCircle(style, data));
          break;
        case 'switch':
          whiteboard.push(this.renderSwitch(style, data));
          break;
        default:
      }
    }

    return whiteboard;
  }

  render() {
    const {
      canvases,
      id,
      time,
    } = this.props;

    const current = canvases.find(canvas => id === canvas.id);
    if (!current) return null;

    const { draws } = current;

    return (
      <g>
        {this.renderWhiteboard(draws, time)}
      </g>
    );
  }
}
