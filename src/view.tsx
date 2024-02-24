import Color from "npm:color";
import React from "npm:react";

type Position = [x: number, y: number];

type Team = {
  name: string;
  color: string;
  usernames: string[];

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

  leftTeam: Team;
  rightTeam: Team;
};

export const buildView = ({
  leftTeam,
  rightTeam,
  challenger1Title,
  challenger2Title,
  bottomTitle,
  copyright,
  version,
  showOnlyBoard,
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
              color: "#1565C0",
              fontWeight: "bold",
              fontSize: 35,
              paddingBottom: 20,
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
            {["@playerx"].map((x) => (
              <div style={{ padding: 10 }}>{x}</div>
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
          <div>{challenger1Title}</div>
          <div>vs</div>
          <div>{challenger2Title}</div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid silver",
          }}
        >
          {new Array(10).fill(0).map((_, y) => (
            <div
              style={{
                display: "flex",
              }}
            >
              {new Array(10).fill(0).map((_, x) => (
                <div
                  style={{
                    width: 55,
                    height: 55,
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
                        width: 40,
                        height: 40,
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
                        width: 40,
                        height: 40,
                      }}
                    ></div>
                  )}
                  {leftTeam.nextMovePreviews
                    .filter(([mY, mX]) => mY === y && mX === x)
                    .map((x) => (
                      <div
                        style={{
                          border:
                            "1px solid " +
                            Color(leftTeam.color).lighten(0.7).hex(),
                          backgroundColor: Color(leftTeam.color)
                            .lighten(0.75)
                            .hex(),
                          borderRadius: "100%",
                          width: 35,
                          height: 35,
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
                    .map((x) => (
                      <div
                        style={{
                          border:
                            "1px solid " +
                            Color(rightTeam.color).lighten(0.7).hex(),
                          backgroundColor: Color(rightTeam.color)
                            .lighten(0.75)
                            .hex(),
                          borderRadius: "100%",
                          width: 35,
                          height: 35,
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
                            leftTeam.nextMovePreviews.indexOf(x)
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
              color: "#C62828",
              fontWeight: "bold",
              fontSize: 35,
              paddingBottom: 20,
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
              <div style={{ padding: 10 }}>{x}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
