import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Anatomy3DProps {
  className?: string;
}

const Anatomy3D = ({ className }: Anatomy3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrgan, setSelectedOrgan] = useState<string>('cœur');
  const [error, setError] = useState<string>('');

  // Données anatomiques simplifiées
  const organs = [
    { id: 'cœur', name: 'Cœur', color: 0xff0000, position: { x: 0, y: 1, z: 0 } },
    { id: 'cerveau', name: 'Cerveau', color: 0xff69b4, position: { x: 0, y: 3, z: 0 } },
    { id: 'poumons', name: 'Poumons', color: 0x87ceeb, position: { x: -1, y: 1.5, z: 0 } },
    { id: 'foie', name: 'Foie', color: 0x8b4513, position: { x: 1, y: 0.5, z: 0 } },
    { id: 'estomac', name: 'Estomac', color: 0xffa500, position: { x: 0.5, y: 0, z: 1 } },
    { id: 'reins', name: 'Reins', color: 0x800080, position: { x: -0.5, y: 0, z: -1 } },
  ];

  useEffect(() => {
    if (!mountRef.current) {
      setError("Conteneur non trouvé");
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si WebGL est supporté
      if (!window.WebGLRenderingContext) {
        setError("WebGL n'est pas supporté par votre navigateur");
        setIsLoading(false);
        return;
      }

      // Initialisation de la scène Three.js
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
      
      // Vider le conteneur avant d'ajouter
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Lumières
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
      scene.add(directionalLight);

      // Lumière ponctuelle
      const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
      pointLight.position.set(0, 5, 0);
      scene.add(pointLight);

      // Création des organes
      organs.forEach(organ => {
        // Géométrie simplifiée pour chaque organe
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
          color: organ.color,
          emissive: organ.color,
          emissiveIntensity: 0.1,
          shininess: 100,
          transparent: true,
          opacity: 0.9
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(organ.position.x, organ.position.y, organ.position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { organId: organ.id, organName: organ.name };
        scene.add(mesh);
      });

      // Système squelettique simplifié
      const createSkeleton = () => {
        const skeletonGroup = new THREE.Group();
        
        // Tête
        const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 3.5, 0);
        skeletonGroup.add(head);

        // Torse
        const torsoGeometry = new THREE.BoxGeometry(1.5, 2, 0.8);
        const torsoMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.set(0, 2, 0);
        skeletonGroup.add(torso);

        // Bras
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1, 2.5, 0);
        skeletonGroup.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1, 2.5, 0);
        skeletonGroup.add(rightArm);

        // Jambes
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.4, 0, 0);
        skeletonGroup.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.4, 0, 0);
        skeletonGroup.add(rightLeg);

        scene.add(skeletonGroup);
      };

      createSkeleton();

      // Animation
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotation automatique
        scene.rotation.y += 0.005;

        // Animation des organes (battement cardiaque, respiration, etc.)
        const time = Date.now() * 0.001;
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.organId) {
            switch (child.userData.organId) {
              case 'cœur':
                // Battement cardiaque
                const scale = 1 + Math.sin(time * 2) * 0.05;
                child.scale.set(scale, scale, scale);
                break;
              case 'poumons':
                // Respiration
                const breathY = organs.find(o => o.id === 'poumons')!.position.y + Math.sin(time * 1.5) * 0.1;
                child.position.y = breathY;
                break;
              case 'cerveau':
                // Activité cérébrale
                child.rotation.y = Math.sin(time * 0.5) * 0.1;
                break;
            }
          }
        });

        renderer.render(scene, camera);
      };

      animate();
      setIsLoading(false);

      // Nettoyage
      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        // Nettoyer les géométries et matériaux
        scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              const material = mesh.material as THREE.Material;
              material.dispose();
            }
          }
        });
      };
    } catch (err) {
      console.error('Erreur Three.js:', err);
      setError(`Erreur d'initialisation 3D: ${err}`);
      setIsLoading(false);
    }
  }, []);

  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current.clientWidth / mountRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 5);
      camera.lookAt(0, 0, 0);

      rendererRef.current.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOrganSelect = (organId: string) => {
    setSelectedOrgan(organId);
    
    // Mettre en surbrillance l'organe sélectionné
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.organId === organId) {
          const material = child.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.5;
        } else if (child instanceof THREE.Mesh && child.userData.organId) {
          const material = child.material as THREE.MeshPhongMaterial;
          material.emissiveIntensity = 0.1;
        }
      });
    }
  };

  if (error) {
    return (
      <Card className={`w-full h-96 ${className}`}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Vérifiez que votre navigateur supporte WebGL
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full h-96 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Atlas Anatomique 3D</span>
          <div className="flex gap-2">
            <Button
              variant={selectedOrgan === 'cœur' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOrganSelect('cœur')}
            >
              Cœur
            </Button>
            <Button
              variant={selectedOrgan === 'cerveau' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOrganSelect('cerveau')}
            >
              Cerveau
            </Button>
            <Button
              variant={selectedOrgan === 'poumons' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleOrganSelect('poumons')}
            >
              Poumons
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Chargement du modèle 3D...</p>
            </div>
          </div>
        ) : (
          <div 
            ref={mountRef} 
            className="w-full h-80 cursor-move"
            style={{ touchAction: 'none' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Anatomy3D;
