{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
    npm
  ];

  shellHook = ''
    echo "Welcome to the Next.js development environment!"
  '';
}