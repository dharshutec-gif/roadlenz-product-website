"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import land110 from "world-atlas/land-110m.json";
import type { OfficeLocation } from "@/lib/types";

type GlobeFilter = "all" | "india" | "international";

function latLngToVector3(lat: number, lng: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function makeGlobeTexture(): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ocean
  const ocean = ctx.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0, "#eaf3fd");
  ocean.addColorStop(1, "#dcebf9");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, W, H);

  // graticule
  ctx.strokeStyle = "rgba(120,160,215,0.28)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // land
  const topo = land110 as any;
  const geo = feature(topo, topo.objects.land) as any;
  const px = (lng: number) => ((lng + 180) / 360) * W;
  const py = (lat: number) => ((90 - lat) / 180) * H;
  ctx.fillStyle = "#b7d2f2";
  ctx.strokeStyle = "#8fb4e4";
  ctx.lineWidth = 1.2;
  for (const f of geo.features) {
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) {
      for (const ring of poly) {
        ctx.beginPath();
        ring.forEach(([lng, lat]: [number, number], i: number) => {
          if (i === 0) ctx.moveTo(px(lng), py(lat));
          else ctx.lineTo(px(lng), py(lat));
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makePulseTexture(): THREE.CanvasTexture {
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(18,89,214,0)");
  g.addColorStop(0.72, "rgba(18,89,214,0.55)");
  g.addColorStop(0.82, "rgba(18,89,214,0.75)");
  g.addColorStop(1, "rgba(18,89,214,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(canvas);
}

function makeAtmosphereTexture(): THREE.CanvasTexture {
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(120,170,240,0)");
  g.addColorStop(0.78, "rgba(120,170,240,0)");
  g.addColorStop(0.88, "rgba(120,170,240,0.28)");
  g.addColorStop(1, "rgba(120,170,240,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(canvas);
}

interface Globe3DProps {
  locations: OfficeLocation[];
  filter: GlobeFilter;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  reducedMotion: boolean;
}

export default function Globe3D({ locations, filter, selectedId, onSelect, reducedMotion }: Globe3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<string | null>(selectedId);
  const stateRef = useRef<{ dispose: () => void } | null>(null);
  const apiRef = useRef<{
    setFilter: (f: GlobeFilter) => void;
    select: (id: string | null) => void;
  } | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL — parent keeps its fallback UI
    }
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0.35, 3.1);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    // globe
    const tex = makeGlobeTexture();
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 36),
      new THREE.MeshBasicMaterial({ map: tex }),
    );
    group.add(globe);

    // atmosphere
    const atmo = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: makeAtmosphereTexture(), transparent: true, depthWrite: false }),
    );
    atmo.scale.set(2.75, 2.75, 1);
    scene.add(atmo);

    // pins
    const pulseTex = makePulseTexture();
    const pinGroup = new THREE.Group();
    group.add(pinGroup);
    const pinMeshes: { id: string; mesh: THREE.Mesh; pulse: THREE.Sprite; base: THREE.Vector3; intl: boolean }[] = [];
    const R = 1.002;

    locations.forEach((loc) => {
      const dir = latLngToVector3(loc.lat, loc.lng, R).normalize();
      const pos = dir.clone().multiplyScalar(R);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.016, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x1259d6, transparent: true }),
      );
      mesh.position.copy(pos);
      mesh.userData.id = loc.id;
      pinGroup.add(mesh);

      const pulse = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: pulseTex, transparent: true, depthWrite: false, opacity: 0.9 }),
      );
      pulse.position.copy(dir.clone().multiplyScalar(R + 0.002));
      pulse.scale.set(0.09, 0.09, 1);
      pinGroup.add(pulse);

      pinMeshes.push({ id: loc.id, mesh, pulse, base: pos, intl: loc.international });
    });

    // arcs: HQ Chennai → international offices
    const hq = locations.find((l) => l.type === "headquarters") ?? locations[0];
    const arcs: { line: THREE.Line; mat: THREE.LineDashedMaterial }[] = [];
    const hqDir = latLngToVector3(hq.lat, hq.lng, 1).normalize();
    locations
      .filter((l) => l.international)
      .forEach((l) => {
        const a = latLngToVector3(hq.lat, hq.lng, 1.0);
        const b = latLngToVector3(l.lat, l.lng, 1.0);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const lift = 1 + 0.35 * a.distanceTo(b) * 0.9;
        const ctrl = mid.clone().normalize().multiplyScalar(lift);
        const curve = new THREE.QuadraticBezierCurve3(a, ctrl, b);
        const points = curve.getPoints(48);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineDashedMaterial({
          color: 0x2a72ec,
          dashSize: 0.045,
          gapSize: 0.035,
          transparent: true,
          opacity: 0.55,
        });
        const line = new THREE.Line(geo, mat);
        line.computeLineDistances();
        group.add(line);
        arcs.push({ line, mat });
      });

    /* orientation */
    const targetQuat = new THREE.Quaternion();
    let slerping = false;
    const startQuat = new THREE.Quaternion();
    let slerpT = 1;

    const centerOn = (lat: number, lng: number) => {
      const local = latLngToVector3(lat, lng, 1).normalize();
      const to = new THREE.Vector3(0, 0, 1);
      targetQuat.setFromUnitVectors(local, to);
      // keep "up" reasonable: pre-multiply small correction is skipped — minimal rotation is fine
      startQuat.copy(group.quaternion);
      slerpT = 0;
      slerping = true;
    };

    /* initial view: centre India */
    centerOn(18, 82);

    /* interaction */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let yawVel = 0;
    let pitchVel = 0;
    let idleFor = 999;
    const el = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yawVel = dx * 0.0045;
      pitchVel = dy * 0.0045;
      applySpin(yawVel, pitchVel);
      idleFor = 0;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    };

    const qYaw = new THREE.Quaternion();
    const yAxis = new THREE.Vector3(0, 1, 0);
    const qPitch = new THREE.Quaternion();
    const xAxis = new THREE.Vector3(1, 0, 0);
    function applySpin(dyaw: number, dpitch: number) {
      if (slerping) slerping = false;
      qYaw.setFromAxisAngle(yAxis, dyaw);
      group.quaternion.premultiply(qYaw);
      qPitch.setFromAxisAngle(xAxis, dpitch);
      group.quaternion.premultiply(qPitch);
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    /* raycast clicks */
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const onClick = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      const meshes = pinMeshes.map((p) => p.mesh);
      const hits = ray.intersectObjects(meshes, false);
      if (hits.length > 0) {
        const id = hits[0].object.userData.id as string;
        onSelectRef.current(id);
        const loc = locationsRef.current.find((l) => l.id === id);
        if (loc) centerOn(loc.lat, loc.lng);
      } else {
        onSelectRef.current(null);
      }
    };
    el.addEventListener("click", onClick);
    el.style.cursor = "grab";

    /* refs so handlers see latest values */
    const onSelectRef = { current: onSelect };
    const locationsRef = { current: locations };

    /* animation loop */
    const clock = new THREE.Clock();
    let raf = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // slerp to target
      if (slerping) {
        slerpT = Math.min(1, slerpT + dt / 0.9);
        const e = 1 - Math.pow(1 - slerpT, 3);
        group.quaternion.slerpQuaternions(startQuat, targetQuat, e);
        if (slerpT >= 1) slerping = false;
      } else if (!dragging) {
        idleFor += dt;
        if (!reducedMotion && idleFor > 2.5 && Math.abs(yawVel) < 0.0001) {
          applySpin(0.0016, 0);
        }
      }
      if (dragging) {
        yawVel *= 0.92;
        pitchVel *= 0.92;
      }

      // pulses
      pinMeshes.forEach((p, i) => {
        const phase = (t * 0.7 + i * 0.37) % 1;
        const s = 0.07 + phase * 0.1;
        p.pulse.scale.set(s, s, 1);
        (p.pulse.material as THREE.SpriteMaterial).opacity = (1 - phase) * 0.85;
        const sel = p.id === selectedIdRef.current;
        const mat = p.mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(sel ? 0xd8453e : 0x1259d6);
        p.mesh.scale.setScalar(sel ? 1.7 : 1);
      });

      // arcs — gentle pulse
      arcs.forEach(({ mat }, i) => {
        mat.opacity = 0.38 + 0.22 * Math.sin(t * 0.8 + i * 1.3);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    apiRef.current = {
      setFilter: (f) => {
        pinMeshes.forEach((p) => {
          const mat = p.mesh.material as THREE.MeshBasicMaterial;
          const dim = f === "india" ? p.intl : f === "international" ? !p.intl : false;
          mat.opacity = dim ? 0.18 : 1;
          (p.pulse.material as THREE.SpriteMaterial).opacity = dim ? 0 : 0.9;
        });
        arcs.forEach(({ mat }) => {
          mat.opacity = f === "india" ? 0.1 : 0.55;
        });
      },
      select: (id) => {
        if (!id) return;
        const loc = locationsRef.current.find((l) => l.id === id);
        if (loc) centerOn(loc.lat, loc.lng);
      },
    };

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    stateRef.current = {
      dispose: () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        el.removeEventListener("click", onClick);
        tex.dispose();
        pulseTex.dispose();
        atmo.material.map?.dispose();
        atmo.material.dispose();
        globe.geometry.dispose();
        (globe.material as THREE.Material).dispose();
        pinMeshes.forEach((p) => {
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.Material).dispose();
          p.pulse.material.dispose();
        });
        arcs.forEach(({ line, mat }) => {
          line.geometry.dispose();
          mat.dispose();
        });
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      },
    };

    return () => {
      stateRef.current?.dispose();
      stateRef.current = null;
      apiRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.setFilter(filter);
  }, [filter]);

  useEffect(() => {
    apiRef.current?.select(selectedId);
  }, [selectedId]);

  /* the render loop reads selection from a ref */
  useEffect(() => {
    selectedIdRef.current = selectedId;
    if (mountRef.current) mountRef.current.dataset.selected = selectedId ?? "";
  }, [selectedId]);

  return <div ref={mountRef} className="h-full w-full" role="img" aria-label="Interactive 3D globe of RoadLenz locations" />;
}
