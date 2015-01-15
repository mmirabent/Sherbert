Sequel.migration do
  change do
    create_table(:titles) do
      primary_key :id
      String :name, :null => false
      String :title, :unique => true, :null => false
      Integer :votes, :null => false
    end
  end
end