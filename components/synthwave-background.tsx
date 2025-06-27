"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"

export default function SynthwaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let scene: THREE.Scene
    let camera: THREE.PerspectiveCamera
    let renderer: THREE.WebGLRenderer
    let composer: EffectComposer
    let grid: THREE.Mesh
    let sun: THREE.Mesh
    let animationId: number

    const init = () => {
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, 4, 15)
      camera.rotation.x = -0.2

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.toneMapping = THREE.ReinhardToneMapping
      renderer.setClearColor(0x0d021a, 1)

      // Post-processing for Neon Glow
      const renderScene = new RenderPass(scene, camera)
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
      bloomPass.threshold = 0
      bloomPass.strength = 1.5
      bloomPass.radius = 0.5

      composer = new EffectComposer(renderer)
      composer.addPass(renderScene)
      composer.addPass(bloomPass)

      // Create the Synthwave Grid
      const gridMaterial = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0.0 },
          u_mouse: { value: new THREE.Vector2() },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float u_time;
          varying vec2 vUv;
          
          void main() {
            vec2 coord = vUv * vec2(30.0, 60.0);
            
            // Animate grid movement
            coord.y += u_time * 5.0;
            
            // Create grid lines
            vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
            float line = min(grid.x, grid.y);
            
            // Add color and glow
            vec3 color = vec3(1.0, 0.3, 0.8); // Hot pink
            float glow = 1.0 - min(line, 1.0);
            
            // Fade out in the distance
            float fade = pow((1.0 - vUv.y), 4.0);
            
            gl_FragColor = vec4(color * glow * fade, 1.0);
          }
        `,
        transparent: true,
      })

      grid = new THREE.Mesh(new THREE.PlaneGeometry(100, 200, 1, 1), gridMaterial)
      grid.rotation.x = -Math.PI / 2
      grid.position.y = -2
      scene.add(grid)

      // Create the Sun
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xff4466, fog: false })
      sun = new THREE.Mesh(new THREE.CircleGeometry(8, 64), sunMaterial)
      sun.position.set(0, 10, -100)
      scene.add(sun)

      // Add some stars
      const starGeometry = new THREE.BufferGeometry()
      const starVertices = []
      for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000
        const y = Math.random() * 1000
        const z = (Math.random() - 0.5) * 2000
        starVertices.push(x, y, z)
      }
      starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3))
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
      const stars = new THREE.Points(starGeometry, starMaterial)
      scene.add(stars)

      animate()
    }

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
    }

    const clock = new THREE.Clock()
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (grid?.material) {
        ;(grid.material as THREE.ShaderMaterial).uniforms.u_time.value = clock.getElapsedTime()
      }

      // Pulsing sun effect
      if (sun) {
        const pulse = Math.sin(clock.getElapsedTime() * 0.5) * 0.1 + 0.9
        sun.scale.set(pulse, pulse, pulse)
      }

      composer.render()
    }

    init()
    window.addEventListener("resize", onWindowResize, false)

    return () => {
      window.removeEventListener("resize", onWindowResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
      <div
        className="fixed top-0 left-0 w-full h-full bg-black/20 -z-5 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.9)" }}
      />
    </>
  )
}
