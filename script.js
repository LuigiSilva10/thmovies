// Aguarda até que o DOM (Document Object Model) esteja completamente carregado
document.addEventListener('DOMContentLoaded', function () {
    // Obtém referências para elementos do HTML usando seus IDs
    const inputItem = document.getElementById('inputItem');
    const btnAdicionar = document.getElementById('btnAdicionar');
    const btnApagar = document.getElementById('btnApagar');
    const listaItens = document.getElementById('listaItens');
    const mensagemErro = document.getElementById('mensagemErro');
    // Recupera itens do armazenamento local ou inicializa um array vazio
    const itens = JSON.parse(localStorage.getItem('itens')) || [];
  
    // Função para salvar os itens no armazenamento local
    function salvarItens() {
      localStorage.setItem('itens', JSON.stringify(itens));
    }
  
    // Função para atualizar a lista de itens na página
    function atualizarLista() {
      listaItens.innerHTML = '';
  
      itens.forEach(item => {
        criarElementoLista(item);
      });
    }
  
    // Função para adicionar um novo item à lista
    function adicionarItem() {
      const novoItem = inputItem.value.trim();
      // Verifica se o novo item não está vazio
      if (novoItem === '') {
        mensagemErro.textContent = 'Por favor, digite um item.';
        return;
      }
  
      mensagemErro.textContent = '';
  
      // Adiciona o novo item à lista e limpa o campo de entrada
      itens.push(novoItem);
      inputItem.value = '';
  
      // Salva os itens atualizados e atualiza a lista na página
      salvarItens();
      atualizarLista();
    }
  
    // Função para remover um item da lista
    function removerItem(item, li) {
      const index = itens.indexOf(item);
      if (index !== -1) {
        itens.splice(index, 1);
        // Salva os itens atualizados e remove o elemento HTML da lista
        salvarItens();
        li.remove();
      }
    }
  
    // Função para exibir o modal de confirmação antes de remover todos os itens
    function exibirModalConfirmacao() {
      const modalHtml = `
      <div class="modal fade" id="confirmacaoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Confirmação</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Tem certeza de que deseja remover todos os itens?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal" id="btnCancelarRemover">Cancelar</button>
              <button type="button" class="btn btn-danger" id="btnConfirmarRemover">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
      // Adiciona o modal ao corpo do documento e exibe
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      $('#confirmacaoModal').modal('show');
  
      // Adiciona evento ao botão "Cancelar" e ao botão "X" do modal
      $('#btnCancelarRemover, #confirmacaoModal .close').on('click', function () {
        $('#confirmacaoModal').modal('hide');
        removerCancelado();
      });
  
      // Adiciona evento ao botão "Confirmar" do modal
      $('#btnConfirmarRemover').on('click', function () {
        removerTodosOsItens();
        $('#confirmacaoModal').modal('hide');
      });
  
      // Adiciona evento ao fechar o modal para garantir que seja removido
      $('#confirmacaoModal').on('hidden.bs.modal', function () {
        $(this).remove();
      });
  
      // Função para remover todos os itens quando confirmado
      function removerTodosOsItens() {
        itens.length = 0;
        salvarItens();
        atualizarLista();
      }
  
      // Função para lidar com o cancelamento da remoção
      function removerCancelado() {
        console.log('Remoção cancelada.');
      }
    }
  
    // Função para criar um elemento de lista para um item
    function criarElementoLista(item) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.textContent = item;
  
      const iconesContainer = document.createElement('div');
      iconesContainer.className = 'icones-container';
  
      // Ícone de lápis para editar o item
      const editarIcon = document.createElement('i');
      editarIcon.className = 'bi bi-pencil edit-icon';
      editarIcon.addEventListener('click', function () {
        iniciarEdicao(item, li);
      });
  
      // Ícone de lixeira para excluir o item
      const trashIcon = document.createElement('i');
      trashIcon.className = 'bi bi-trash delete-icon';
      trashIcon.addEventListener('click', function () {
        removerItem(item, li);
      });
  
      iconesContainer.appendChild(editarIcon);
      iconesContainer.appendChild(trashIcon);
  
      li.appendChild(iconesContainer);
  
      listaItens.appendChild(li);
    }
  
    // Função para iniciar a edição de um item
    function iniciarEdicao(item, li) {
      const inputEdicao = document.createElement('input');
      inputEdicao.type = 'text';
      inputEdicao.value = item;
      inputEdicao.className = 'form-control';
  
      // Ícone de marca de seleção para salvar as alterações
      const salvarIcon = document.createElement('i');
      salvarIcon.className = 'bi bi-check save-icon';
      salvarIcon.addEventListener('click', function () {
        salvarEdicao(item, li, inputEdicao);
      });
  
      // Ícone de "X" para cancelar as alterações
      const cancelarIcon = document.createElement('i');
      cancelarIcon.className = 'bi bi-x cancel-icon';
      cancelarIcon.addEventListener('click', function () {
        cancelarEdicao(item, li, inputEdicao);
      });
  
      // Substitui o conteúdo da <li> pelos elementos de edição
      li.innerHTML = '';
      li.appendChild(inputEdicao);
      li.appendChild(salvarIcon);
      li.appendChild(cancelarIcon);
  
      // Dá foco ao campo de edição
      inputEdicao.focus();
    }
  
    // Função para salvar as alterações feitas durante a edição
    function salvarEdicao(itemAntigo, li, inputEdicao) {
      const novoTexto = inputEdicao.value.trim();
      if (novoTexto !== '') {
        const index = itens.indexOf(itemAntigo);
        if (index !== -1) {
          itens[index] = novoTexto;
          salvarItens();
          criarElementoLista(novoTexto);
          li.remove();
        }
      }
    }
  
    // Função para cancelar a edição e restaurar o item original
    function cancelarEdicao(itemAntigo, li, inputEdicao) {
      li.innerHTML = itemAntigo;
      const iconesContainer = document.createElement('div');
      iconesContainer.className = 'icones-container';
  
      // Ícone de lápis para editar o item
      const editarIcon = document.createElement('i');
      editarIcon.className = 'bi bi-pencil edit-icon';
      editarIcon.addEventListener('click', function () {
        iniciarEdicao(itemAntigo, li);
      });
  
      // Ícone de lixeira para excluir o item
      const trashIcon = document.createElement('i');
      trashIcon.className = 'bi bi-trash delete-icon';
      trashIcon.addEventListener('click', function () {
        removerItem(itemAntigo, li);
      });
  
      iconesContainer.appendChild(editarIcon);
      iconesContainer.appendChild(trashIcon);
  
      li.appendChild(iconesContainer);
    }
  
    // Adiciona eventos aos botões e campos de entrada
    btnAdicionar.addEventListener('click', adicionarItem);
    btnApagar.addEventListener('click', function () {
      exibirModalConfirmacao();
    });
  
    // Adiciona evento para adicionar itens ao pressionar "Enter"
    inputItem.addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        adicionarItem();
      }
    });
  
    // Atualiza a lista na inicialização
    atualizarLista();
  });
  