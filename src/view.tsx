import Color from "npm:color";
import React from "npm:react";

type Position = [x: number, y: number];

type Team = {
  name: string;
  color: string;
  usernames: string[];
  points: number;

  moves: Position[];

  nextMovePreviews: Position[];
};

type Props = {
  challenger1Title: string;
  challenger2Title: string;
  bottomTitle: string;
  copyright: string;
  version: string;
  showOnlyBoard: boolean;
  boardSize: number;

  leftTeam: Team;
  rightTeam: Team;

  warningMessage: string;
};

export const buildView = ({
  leftTeam,
  rightTeam,
  challenger1Title,
  challenger2Title,
  bottomTitle,
  copyright,
  version,
  boardSize,
  showOnlyBoard,
  warningMessage,
}: Props) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* Left Team */}
      {!showOnlyBoard && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: 20,
            paddingTop: 20,
            fontSize: 20,
          }}
        >
          <div
            style={{
              color: Color(leftTeam.color).darken(0.2).hex(),
              fontWeight: "bold",
              fontSize: 35,
              paddingBottom: 0,
              marginBottom: 20,
              marginRight: 30,
              alignSelf: "stretch",
              borderBottom:
                "3px solid " + Color(leftTeam.color).darken(0.2).hex(),
            }}
          >
            {leftTeam.name}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              marginRight: 15,
            }}
          >
            {leftTeam.usernames.map((x) => (
              <div key={x} style={{ padding: 10 }}>
                {x}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Board */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          backgroundColor: "#fff",
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            fontWeight: "400",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 10,
            }}
          >
            <div
              style={{
                border: "3px solid " + Color(leftTeam.color).darken(0.3).hex(),
                backgroundColor: leftTeam.color,
                borderRadius: "100%",
                width: 30,
                height: 30,
                marginRight: 4,
              }}
            ></div>
            <div style={{ color: leftTeam.color }}>
              {leftTeam.points.toString()}
            </div>
          </div>

          <div style={{ color: Color(leftTeam.color).darken(0.2).hex() }}>
            {challenger1Title}
          </div>
          <div style={{ marginLeft: 7, marginRight: 7 }}>vs</div>
          <div style={{ color: Color(rightTeam.color).darken(0.2).hex() }}>
            {challenger2Title}
          </div>

          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              paddingTop: 10,
            }}
          >
            <div style={{ color: rightTeam.color }}>
              {rightTeam.points.toString()}
            </div>
            <div
              style={{
                border: "3px solid " + Color(rightTeam.color).darken(0.3).hex(),
                backgroundColor: rightTeam.color,
                borderRadius: "100%",
                width: 30,
                height: 30,
                marginLeft: 4,
              }}
            ></div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid silver",
          }}
        >
          {new Array(boardSize).fill(0).map((_, y) => (
            <div
              key={"col" + y}
              style={{
                display: "flex",
              }}
            >
              {new Array(boardSize).fill(0).map((_, x) => (
                <div
                  key={"row" + x}
                  style={{
                    width: 65,
                    height: 65,
                    border: "1px solid #f4f4f4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {leftTeam.moves.find(([mY, mX]) => mY === y && mX === x) && (
                    <div
                      style={{
                        border:
                          "3px solid " +
                          Color(leftTeam.color).darken(0.3).hex(),
                        backgroundColor: leftTeam.color,
                        borderRadius: "100%",
                        width: 50,
                        height: 50,
                      }}
                    ></div>
                  )}
                  {rightTeam.moves.find(([mY, mX]) => mY === y && mX === x) && (
                    <div
                      style={{
                        border:
                          "3px solid " +
                          Color(rightTeam.color).darken(0.3).hex(),
                        backgroundColor: rightTeam.color,
                        borderRadius: "100%",
                        width: 50,
                        height: 50,
                      }}
                    ></div>
                  )}
                  {leftTeam.nextMovePreviews
                    .filter(([mY, mX]) => mY === y && mX === x)
                    .map((x, i) => (
                      <div
                        key={"a_next_move" + i}
                        style={{
                          border:
                            "1px solid " +
                            Color(leftTeam.color).lighten(0.6).hex(),
                          backgroundColor: Color(leftTeam.color)
                            .lighten(0.75)
                            .hex(),
                          borderRadius: "100%",
                          width: 45,
                          height: 45,
                          opacity: 1,
                          color: leftTeam.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          fontWeight: 300,
                        }}
                      >
                        {String.fromCharCode(
                          "A".charCodeAt(0) +
                            leftTeam.nextMovePreviews.indexOf(x)
                        )}
                      </div>
                    ))}

                  {rightTeam.nextMovePreviews
                    .filter(([mY, mX]) => mY === y && mX === x)
                    .map((x, i) => (
                      <div
                        key={"a_next_move" + i}
                        style={{
                          border:
                            "1px solid " +
                            Color(rightTeam.color).lighten(0.55).hex(),
                          backgroundColor: Color(rightTeam.color)
                            .lighten(0.65)
                            .hex(),
                          borderRadius: "100%",
                          width: 45,
                          height: 45,
                          opacity: 1,
                          color: Color(rightTeam.color).darken(0.5).hex(),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          fontWeight: 300,
                        }}
                      >
                        {String.fromCharCode(
                          "A".charCodeAt(0) +
                            rightTeam.nextMovePreviews.indexOf(x)
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            fontStyle: "italic",
            fontWeight: 300,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 3,
            }}
          >
            {copyright}
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {bottomTitle}
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              fontSize: 20,
              marginBottom: 5,
              marginLeft: 3,
            }}
          >
            {version}
          </div>
        </div>
      </div>

      {/* Right Team */}
      {!showOnlyBoard && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            paddingRight: 20,
            paddingTop: 20,
            fontSize: 20,
          }}
        >
          <div
            style={{
              color: Color(rightTeam.color).darken(0.2).hex(),
              fontWeight: "bold",
              fontSize: 35,
              paddingBottom: 0,
              marginBottom: 20,
              marginLeft: 30,
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "flex-end",
              borderBottom:
                "3px solid " + Color(rightTeam.color).darken(0.2).hex(),
            }}
          >
            {rightTeam.name}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              marginLeft: 15,
            }}
          >
            {rightTeam.usernames.map((x) => (
              <div key={x} style={{ padding: 10 }}>
                {x}
              </div>
            ))}
          </div>
        </div>
      )}

      {!!warningMessage && (
        <div
          style={{
            position: "absolute",
            top: 50,
            left: 10,
            right: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              border: "1px solid orange",
              background: "yellow",
              color: "brown",
              borderRadius: 10,
              padding: 10,
              minWidth: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {warningMessage}
          </div>
        </div>
      )}
    </div>
  );
};
