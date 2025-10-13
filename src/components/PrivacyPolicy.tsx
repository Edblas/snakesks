import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Database, Users, Lock, AlertTriangle } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
  isVisible: boolean;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="text-blue-500" size={24} />
            Política de Privacidade - Snake SKS
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 text-gray-300">
          <div className="space-y-4">
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Eye className="text-blue-400" size={20} />
                Informações que Coletamos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Dados de Jogo:</strong> Pontuações, tempo de jogo, progresso</li>
                <li>• <strong>Dados de Dispositivo:</strong> Tipo de dispositivo, sistema operacional, identificador único</li>
                <li>• <strong>Dados de Uso:</strong> Como você interage com o aplicativo</li>
                <li>• <strong>Dados de Publicidade:</strong> Interações com anúncios, preferências</li>
                <li>• <strong>Dados de Localização:</strong> Localização aproximada (apenas para anúncios regionais)</li>
              </ul>
            </div>

            <div className="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Database className="text-green-400" size={20} />
                Como Usamos Suas Informações
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Funcionalidade do Jogo:</strong> Salvar progresso, rankings, conquistas</li>
                <li>• <strong>Personalização:</strong> Adaptar a experiência do usuário</li>
                <li>• <strong>Anúncios:</strong> Exibir anúncios relevantes e personalizados</li>
                <li>• <strong>Análise:</strong> Melhorar o desempenho e recursos do aplicativo</li>
                <li>• <strong>Suporte:</strong> Resolver problemas técnicos e dúvidas</li>
              </ul>
            </div>

            <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Users className="text-purple-400" size={20} />
                Compartilhamento de Dados
              </h3>
              <div className="space-y-3 text-sm">
                <p><strong>Parceiros de Publicidade:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• Google AdMob - Para exibição de anúncios</li>
                  <li>• Redes de anúncios terceirizadas</li>
                  <li>• Provedores de análise de dados</li>
                </ul>
                <p><strong>Não vendemos seus dados pessoais para terceiros.</strong></p>
              </div>
            </div>

            <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Lock className="text-yellow-400" size={20} />
                Seus Direitos e Controles
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Consentimento:</strong> Você pode retirar o consentimento a qualquer momento</li>
                <li>• <strong>Anúncios Personalizados:</strong> Pode optar por anúncios não personalizados</li>
                <li>• <strong>Acesso aos Dados:</strong> Solicitar cópia dos seus dados</li>
                <li>• <strong>Exclusão:</strong> Solicitar exclusão dos seus dados</li>
                <li>• <strong>Correção:</strong> Corrigir informações incorretas</li>
              </ul>
            </div>

            <div className="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={20} />
                Proteção de Menores (COPPA)
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nosso aplicativo é adequado para idades 13+</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Não coletamos intencionalmente dados de menores de 13 anos</li>
                  <li>• Pais podem solicitar exclusão de dados de menores</li>
                  <li>• Anúncios são filtrados para conteúdo apropriado</li>
                  <li>• Não há comunicação direta entre usuários</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Segurança dos Dados</h3>
              <p className="text-sm">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Retenção de Dados</h3>
              <p className="text-sm">
                Mantemos seus dados apenas pelo tempo necessário para fornecer nossos serviços ou 
                conforme exigido por lei. Dados de jogo são mantidos enquanto sua conta estiver ativa.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Alterações na Política</h3>
              <p className="text-sm">
                Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas 
                através do aplicativo ou por outros meios apropriados.
              </p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Contato</h3>
              <p className="text-sm">
                Para questões sobre privacidade, entre em contato conosco em: 
                <br />
                <strong>Email:</strong> privacy@snake-sks.com
                <br />
                <strong>Endereço:</strong> [Seu endereço comercial]
              </p>
            </div>

            <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-700">
              <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              <p>Esta política está em conformidade com GDPR, COPPA e políticas do Google AdMob</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;